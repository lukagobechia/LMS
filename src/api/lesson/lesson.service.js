import LessonModel from "./lesson.model.js";
import { uploadFile } from "../file/file.service.js";
import { createQuiz } from "./quiz/quiz.service.js";

export const addLesson = async (lessonData) => {
  const lesson = new LessonModel(lessonData);
  await lesson.save();
  return lesson;
};

export const getAllLessons = async () => {
  return await LessonModel.find().sort("order");
};

export const getLessonById = async (lessonId) => {
  const lesson = await LessonModel.findById(lessonId).populate("course");
  return lesson;
};

export const getLessonsByCourse = async (courseId) => {
  return LessonModel.find({ course: courseId }).sort("order");
};

export const updateLesson = async (lessonId, updateData) => {
  const updated = await LessonModel.findByIdAndUpdate(lessonId, updateData, {
    new: true,
  });
  if (!updated) throw new Error("Lesson not found");
  return updated;
};

export const deleteLesson = async (lessonId) => {
  const deleted = await LessonModel.findByIdAndDelete(lessonId);
  if (!deleted) throw new Error("Lesson not found");
  return deleted;
};

export const addLessonContent = async (req, res) => {
  try {
    const { type, value, questions } = req.body;
    const { lessonId } = req.params;

    let contentItem;

    const lesson = await LessonModel.findById(lessonId);

    if (!lesson || !lesson.course) {
      return res
        .status(404)
        .json({ error: "Lesson or associated course not found" });
    }

    if (type === "File") {
      const { file } = await uploadFile(
        req.file,
        req.params.lessonId,
        lesson.course,
        req.user.userId
      );
      contentItem = { type: "File", value: file._id };
    } else if (type === "Video") {
      contentItem = { type: "Video", value };
    } else if (type === "Quiz") {
      const quiz = await createQuiz(lessonId, questions);
      contentItem = { type: "Quiz", value: quiz._id };
    } else {
      return res
        .status(400)
        .json({
          error:
            "Invalid content type, possible error: capitalize first letter",
        });
    }

    await LessonModel.findByIdAndUpdate(lessonId, {
      $push: { content: contentItem },
    });

    return res.status(201).json({ message: "Content added", contentItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
