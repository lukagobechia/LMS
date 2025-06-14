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

