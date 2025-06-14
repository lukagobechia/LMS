import mongoose from "mongoose";

const openAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz.questions" },
  answer: String,
  score: { type: Number, default: null },
  points: { type: Number, default: 0 },
});

const quizSubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      answer: String,
    },
  ],
  openAnswers: [openAnswerSchema],
  mcqScore: Number,
  openQuestionScore: Number,
  totalScore: Number,
  submittedAt: { type: Date, default: Date.now },
});

const QuizSubmissionModel = mongoose.model(
  "QuizSubmission",
  quizSubmissionSchema
);
export default QuizSubmissionModel;
