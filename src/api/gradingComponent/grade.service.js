import GradingComponent from "./gradingComponent.model.js";
import Grade from "./grade.model.js";
import Course from "../course/course.model.js";

export const createGradingComponents = async (req, res) => {
    try {
        const { courseId } = req.params;
        const components = req.body;

        const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
        if (totalWeight !== 100) {
            return res.status(400).json({ message: "Total weight must equal 100" });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (String(course.instructor) !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await GradingComponent.deleteMany({ course: courseId });
        const created = await GradingComponent.insertMany(
            components.map(c => ({ ...c, course: courseId, createdBy: req.user.userId }))
        );

        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getGradingComponents = async (req, res) => {
    try {
        const { courseId } = req.params;
        const components = await GradingComponent.find({ course: courseId });
        res.json(components);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const assignGrades = async (req, res) => {
    try {
        const { courseId } = req.params;
        const grades = req.body; 

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (String(course.instructor) !== req.user.userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const bulkOps = grades.map(({ studentId, componentId, score }) => ({
            updateOne: {
                filter: { student: studentId, course: courseId, component: componentId },
                update: { score, gradedAt: new Date() },
                upsert: true
            }
        }));

        await Grade.bulkWrite(bulkOps);
        res.json({ message: "Grades submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getStudentGrades = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.userId;

        const components = await GradingComponent.find({ course: courseId }).lean();
        const grades = await Grade.find({
            course: courseId,
            student: studentId
        }).populate("component").lean();

        const result = components.map(comp => {
            const grade = grades.find(g => g.component._id.toString() === comp._id.toString());
            return {
                component: comp.name,
                weight: comp.weight,
                score: grade ? grade.score : 0
            };
        });

        const totalScore = result.reduce((sum, g) => sum + g.score, 0);

        res.json({
            breakdown: result,
            total: totalScore,
            outOf: 100
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
