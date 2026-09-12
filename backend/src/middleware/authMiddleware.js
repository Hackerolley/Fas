import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects private routes by reading a Bearer token from the Authorization header.
export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : req.headers.cookie?.match(/(?:^|;\s*)froyal_access_token=([^;]+)/)?.[1];

  if (token) token = decodeURIComponent(token);

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, token missing."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, account no longer exists.");
    }
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
