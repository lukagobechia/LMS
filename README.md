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
