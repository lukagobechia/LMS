Auth resource

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| `POST` | `/auth/sign-up`                | Register a new user            |
| `POST` | `/auth/sign-in`                | Log in with email and password |
| `POST` | `/auth/verify-email`           | Verify user's email with OTP   |
| `POST` | `/auth/resend-verify-email`    | Resend email verification OTP  |
| `POST` | `/auth/request-reset-password` | Request password reset link    |
| `POST` | `/auth/reset-password`         | Reset password using token     |

User resource

| Method   | Endpoint   | Description                 |
| -------- | ---------- | --------------------------- |
| `GET`    | `/user/me` | Get current user profile    |
| `PATCH`  | `/user/me` | Update current user profile |
| `DELETE` | `/user/me` | Delete own account          |
| `PATCH`  | `/user/:id` | Update user by ID          |
| `DELETE` | `/user/:id` | Delete user by ID          |

Course resource

| Method   | Endpoint       | Description                           |
| -------- | -------------- | ------------------------------------- |
| `GET`    | `/courses/`    | Get all courses                       |
| `GET`    | `/courses/:id` | Get course by ID                      |
| `POST`   | `/courses/`    | Create a new course (Instructor only) |
| `PUT`    | `/courses/:id` | Update a course (Instructor only)     |
| `DELETE` | `/courses/:id` | Delete a course (Instructor only)     |

Lesson resource

| Method   | Endpoint                | Description                            |
| -------- | ----------------------- | -------------------------------------- |
| `GET`    | `/lessons/all`          | Get all lessons                        |
| `GET`    | `/lessons/:lessonId`    | Get lesson by ID                       |
| `GET`    | `/lessons?courseId=...` | Get lessons by course ID (query param) |
| `POST`   | `/lessons/`             | Add a new lesson (Instructor only)     |
| `PUT`    | `/lessons/:lessonId`    | Update lesson (Instructor only)        |
| `DELETE` | `/lessons/:lessonId`    | Delete lesson (Instructor only)        |

Lesson Progress

| Method | Endpoint                                 | Description                               |
| -------| -----------------------------------------| ----------------------------------------- |
| POST   | /api/progress/lessons/:lessonId/complete | Mark lesson as completed (student only)   |
| DELETE | /api/progress/lessons/:lessonId/complete | Unmark lesson as completed (student only) |
| GET    | /api/progress/:courseId                  | Get completed lessons for a course        |

Enrollment resource

| Method   | Endpoint                | Description                            |
| -------- | ----------------------- | -------------------------------------- |
| `POST`   | `/enrollment/:courseId` | Enroll current student in a course     |
| `GET`    | `/enrollment/my-courses`| Retrieve all courses the current student is enrolled in|
| `GET`    | `/enrollment/enrolled-students/:courseId` | Get all students enrolled in a specific course|

Attendance resource

| Method | Endpoint                | Description                                                        |
| ------ | ----------------------- | ------------------------------------------------------------------ |
| `POST` | `/attendance/:lessonId` | Submit attendance for a specific lesson (Instructor only)          |
| `GET`  | `/attendance/my`        | Get current student’s attendance records                           |
| `GET`  | `/attendance/:courseId` | Get all attendance records for a specific course (Instructor only) |


File Management Endpoints

| Method   | Endpoint              | Description                                             | Roles                   |
| -------- | --------------------- | ------------------------------------------------------- | ----------------------- |
| `POST`   | `/file/upload`       | Upload a file to AWS S3 and persist metadata in MongoDB | `instructor`            |
| `GET`    | `/file/:id/download` | Generate a time-limited (1 h) signed download URL       | `student`, `instructor` |
| `DELETE` | `/file/:id/delete`   | Remove the file from S3 and delete its metadata record  | `instructor`            |


Quiz Management

| Method | Endpoint                                    | Roles                   | Description                                               |
| ------ | ------------------------------------------- | ----------------------- | --------------------------------------------------------- |
| `POST` | `/lessons/quiz/:lessonId`                       | `instructor`            | Create a quiz with a list of questions for a given lesson |
| `GET`  | `/lessons/quiz/:quizId`                         | `student`, `instructor` | Fetch and shuffle quiz questions and their options        |
| `POST` | `/lessons/quiz/:quizId/submit`                  | `student`               | Submit quiz answers, auto-grades MCQ questions            |
| `PUT`  | `/lessons/quiz-submissions/:submissionId/grade` | `instructor`            | Grade open-ended questions and compute final score        |
| `GET`  | `/lessons/quiz-results/:quizId`                 | `instructor`            | View all submissions and scores for a quiz                |
| `GET`  | `/lessons/quiz-results/:quizId/student`         | `student`               | View individual quiz result (MCQ + open)                  |

Grading System

| Method | Endpoint                               | Description                                                   | Role                 |
| ------ | -------------------------------------- | ------------------------------------------------------------- | -------------------- |
| `POST` | `/grades/courses/:courseId/components` | Create grading components for a course (e.g. Quiz, Midterm)   | Instructor only      |
| `GET`  | `/grades/courses/:courseId/components` | Get all grading components for a course                       | Instructor & Student |
| `POST` | `/grades/courses/:courseId/grades`     | Assign or update student scores for grading components        | Instructor only      |
| `GET`  | `/grades/grades/my/:courseId`          | View all grades and total score for the authenticated student | Student only         |

GPA 

| Method | Endpoint                     | Description                           | Role    |
| ------ | ---------------------------- | ------------------------------------- | ------- |
| `GET`  | `/grades/gpa/my/per-course`  | Get GPA details for a specific course | Student |
| `GET`  | `/grades/gpa/my/cumulative ` | Get cumulative GPA across all courses | Student |
