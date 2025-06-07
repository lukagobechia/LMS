  import CourseModel from "./course.model.js";

  export const createCourse = async (req, res) => {
    try {
      const data = req.body;
      data.instructor = req.user.userId;
      console.log(data);
      await CourseModel.create(data);
      return res
        .status(201)
        .json({ message: "Course created successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
      throw new Error(error.message);
    }
  };

  export const getCourses = async (req, res) => {
    try {
      const courses = await CourseModel.find().populate("instructor", "firstName lastName email");
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch courses: ${error.message}` });
    }
  };

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findById(id).populate("instructor", "firstName lastName email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: `Failed to get course by ID: ${error.message}` });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CourseModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course updated successfully", course: updated });
  } catch (error) {
    res.status(500).json({ message: `Failed to update course: ${error.message}` });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CourseModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete course: ${error.message}` });
  }
};