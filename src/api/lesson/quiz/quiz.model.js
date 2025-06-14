import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const quizSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    questions: [questionSchema],
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
