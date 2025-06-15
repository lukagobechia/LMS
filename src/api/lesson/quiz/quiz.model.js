import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String },
  type: { type: String, enum: ["multiple", "open"], default: "multiple" },
  points: { type: Number, default: 1 },
});

const quizSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    questions: [questionSchema],
    attemptLimit: {
      type: Number,
      default: 1,
    },
    timeLimit: {
      type: Number,
      default: null,
    },
    totalPossibleMcqScore: { type: Number, default: 0 },
    totalPossibleOpenScore: { type: Number, default: 0 },
    totalPossibleQuizScore: { type: Number, default: 0 },
    numberOfMcqQuestions: { type: Number, default: 0 },
    numberOfOpenQuestions: { type: Number, default: 0 },
    numberOfQuestions: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "quizzes",
    read: "nearest",
    writeConcern: {
      w: "majority",
      j: true,
      wtimeoutMS: 30000,
    },
  }
);

const QuizModel = mongoose.model("Quiz", quizSchema);

export default QuizModel;
