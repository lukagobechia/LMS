import QuizModel from "./quiz.model.js";
import QuizSubmissionModel from "./quizSubmission.model.js";
import { shuffleArray } from "../../../utils/utils.js";

export const createQuiz = async (lessonId, questions) => {
  const quiz = await QuizModel.create({ lessonId, questions });

  let totalPossibleMcqScore = 0;
  let totalPossibleOpenScore = 0;
  let numberOfMcqQuestions = 0;
  let numberOfOpenQuestions = 0;

  for (const q of questions) {
    if (q.type === "multiple") {
      totalPossibleMcqScore += Number(q.points) || 1;
      numberOfMcqQuestions += 1;
    } else if (q.type === "open") {
      totalPossibleOpenScore += Number(q.points) || 1;
      numberOfOpenQuestions += 1;
    }
  }

  const totalPossibleQuizScore = totalPossibleMcqScore + totalPossibleOpenScore;
  const numberOfQuestions = numberOfMcqQuestions + numberOfOpenQuestions;

  quiz.totalPossibleMcqScore = totalPossibleMcqScore;
  quiz.totalPossibleOpenScore = totalPossibleOpenScore;
  quiz.totalPossibleQuizScore = totalPossibleQuizScore;
  quiz.numberOfMcqQuestions = numberOfMcqQuestions;
  quiz.numberOfOpenQuestions = numberOfOpenQuestions;
  quiz.numberOfQuestions = numberOfQuestions;

  await quiz.save();
  return quiz;
};

export const getQuiz = async (quizId) => {
  const quiz = await QuizModel.findById(quizId).lean();
  if (!quiz) throw new Error("Quiz not found");

  quiz.questions = shuffleArray(quiz.questions);

  quiz.questions = quiz.questions.map((q) => ({
    ...q,
    options: shuffleArray([...q.options]),
  }));

  return quiz;
};

export const getQuizResults = async (quizId) => {
  const submissions = await QuizSubmissionModel.find({ quiz: quizId }).populate(
    "student",
    "firstName lastName email"
  );
  return submissions;
};

export const getQuizResultsStudent = async (quizId, userId) => {
  const submission = await QuizSubmissionModel.findOne({
    quiz: quizId,
    student: userId,
  }).populate("student", "firstName lastName email");
  return submission;
};

export const submitQuiz = async (quizId, userId, submittedAnswers) => {
  console.log("hits");
  const quiz = await QuizModel.findById(quizId).lean();
  if (!quiz) throw new Error("Quiz not found");

  let autoScore = 0;
  const answers = [];
  const openAnswers = [];

  for (const question of quiz.questions) {
    const userAnswer = submittedAnswers.find(
      (a) => a.questionId && a.questionId.toString() === question._id.toString()
    );

    if (!userAnswer) continue;

    const points = Number(question.points) || 1;

    if (question.type === "multiple") {
      answers.push({
        questionId: question._id,
        answer: userAnswer.answer,
      });

      if (
        userAnswer.answer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase()
      ) {
        autoScore += points;
      }
    } else if (question.type === "open") {
      openAnswers.push({
        questionId: question._id,
        answer: userAnswer.answer,
        score: null,
        points: question.points || 1,
      });
    }
  }

  const openQuestionScore = 0;
  const totalScore = autoScore + openQuestionScore;
  const submission = await QuizSubmissionModel.create({
    student: userId,
    quiz: quizId,
    answers,
    openAnswers,
    mcqScore: autoScore,
    openQuestionScore,
    totalScore: totalScore,
    submittedAt: new Date(),
  });

  return {
    message:
      "Quiz submitted successfully for grading, open-ended questions will be graded by instructor later",
    mcqScore: autoScore,
    openQuestionScore,
    totalScore: totalScore,
    submissionId: submission._id,
  };
};

export const gradeOpenAnswers = async (submissionId, grades) => {
  try {
    const submission = await QuizSubmissionModel.findById(submissionId);
    if (!submission) return { message: "Submission not found" };

    submission.openAnswers = submission.openAnswers.map((oa) => {
      const graded = grades.find(
        (g) => g.questionId === oa.questionId.toString()
      );
      if (graded) oa.score = graded.score;
      return oa;
    });

    const openQuestionScore =
      submission.openAnswers.reduce((sum, a) => sum + (a.score || 0), 0) || 0;

    submission.openQuestionScore = openQuestionScore;
    submission.totalScore = submission.mcqScore + openQuestionScore;

    await submission.save();
    return {
      message: "Graded successfully",
      mcqScore: submission.mcqScore,
      openQuestionScore: submission.openQuestionScore,
      totalScore: submission.totalScore,
    };
  } catch (err) {
    return { message: err.message };
  }
};
