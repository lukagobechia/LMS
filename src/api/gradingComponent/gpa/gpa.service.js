import CourseModel from "../../course/course.model.js";
import GradeModel from "../grade.model.js";

function scoreToGpa(score) {
  if (score < 51) return { letter: "F", gpa4: 0 };
  if (score < 61) return { letter: "D", gpa4: 1 };
  if (score < 71) return { letter: "C", gpa4: 2 };
  if (score < 81) return { letter: "B", gpa4: 3 };
  if (score <= 100) return { letter: "A", gpa4: 4 };
  return { letter: "F", gpa4: 0 };
}

async function calculateCourseScore(studentId, courseId) {
  const grades = await GradeModel.find({
    student: studentId,
    course: courseId,
  });
  return grades.reduce((acc, grade) => acc + grade.score, 0);
}

export async function getGpaPerCourse(studentId) {
  const courses = await GradeModel.distinct("course", { student: studentId });
  const results = [];

  for (const courseId of courses) {
    const course = await CourseModel.findById(courseId);
    if (!course) continue;
    const credits = course.credits || 1;
    const totalScore = await calculateCourseScore(studentId, courseId);
    const { letter, gpa4 } = scoreToGpa(totalScore);

    results.push({
      courseId,
      courseCode: course.courseCode,
      title: course.title,
      credits,
      totalScore,
      letterGrade: letter,
      gpa4Scale: gpa4,
    });
  }

  return results;
}

export async function getCumulativeGpa(studentId) {
  const courses = await GradeModel.distinct("course", { student: studentId });

  let totalWeightedGpa4 = 0;
  let totalWeightedScore100 = 0;
  let totalCredits = 0;

  for (const courseId of courses) {
    const course = await CourseModel.findById(courseId);
    if (!course) continue;
    const credits = course.credits || 1;
    const totalScore = await calculateCourseScore(studentId, courseId);
    const { gpa4 } = scoreToGpa(totalScore);

    totalWeightedGpa4 += gpa4 * credits;
    totalWeightedScore100 += totalScore * credits;
    totalCredits += credits;
  }

  const cumulativeGpa4 = totalCredits ? totalWeightedGpa4 / totalCredits : 0;
  const cumulativeScore100 = totalCredits
    ? totalWeightedScore100 / totalCredits
    : 0;

  return {
    cumulativeGpa4: Number(cumulativeGpa4.toFixed(2)),
    cumulativeScore100: Number(cumulativeScore100.toFixed(2)),
  };
}
