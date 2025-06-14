import QuizModel from "./quiz.model.js";

import { shuffleArray } from "../../../utils/utils.js";
export const createQuiz = async (lessonId, questions) => {
  const quiz = await QuizModel.create({ lessonId, questions });
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

export const submitQuiz = async (quizId, submittedAnswers) => {
  const quiz = await QuizModel.findById(quizId).lean();

  const correctMap = quiz.questions.reduce((map, q) => {
    map[q._id.toString()] = q.correctAnswer;
    return map;
  }, {});

  let score = 0;
  for (const { questionId, answer } of submittedAnswers) {
    if (correctMap[questionId] === answer) score++;
  }

  return {message: 'Quiz Sent Succesfully for Evaluation', score, total: quiz.questions.length };
};
