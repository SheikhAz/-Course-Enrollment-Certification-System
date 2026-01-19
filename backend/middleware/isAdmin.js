const isAdmin = (req, res, next) => {
  // req.user is set by authMiddleware (JWT)
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

export default isAdmin;
