const authorization = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated. Please log in first.",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to access this",
      });
    }

    next();
  };
};
module.exports = { authorization };
