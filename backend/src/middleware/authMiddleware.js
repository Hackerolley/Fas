import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects private routes by reading a Bearer token from the Authorization header.
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, token missing."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, token invalid."));
  }
};

// Restricts selected routes to admin users only.
export const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  res.status(403);
  next(new Error("Admin access required."));
};
