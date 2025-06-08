export const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const userRole = req.user.role;

    if (userRole === "administration" || allowedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: Access denied" });
  };
};
