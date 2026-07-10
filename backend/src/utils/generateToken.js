import jwt from "jsonwebtoken";

// Signs a JWT for authenticated requests. Keep JWT_SECRET private in .env.
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

export default generateToken;
