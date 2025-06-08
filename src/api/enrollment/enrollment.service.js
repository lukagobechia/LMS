import EnrollmentModel from "./enrollment.model.js";

export const enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { courseId } = req.params;

    const existing = await EnrollmentModel.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(409).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await EnrollmentModel.create({
      student: studentId,
      course : courseId
    });

    res.status(201).json({ message: "Enrolled successfully", data: enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const courses = await EnrollmentModel.find({ student: studentId })
      .populate({ path: "course", select: "_id courseCode title category" })
      .lean();

    res.json({ data: courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    const students = await EnrollmentModel.find({ course: courseId })
      .populate({ path: "student", select: "_id firstName lastName email" })
      .lean();

    res.json({ data: students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
