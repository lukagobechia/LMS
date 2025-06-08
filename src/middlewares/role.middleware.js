export const Roles = Object.freeze({
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "administration",
});

export const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const userRole = req.user.role;

    if (userRole === Roles.ADMIN || allowedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: Access denied" });
  };
};
