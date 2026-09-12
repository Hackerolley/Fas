// Handles unknown routes with a clear API-friendly error.
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Normalizes thrown errors so controllers can stay clean.
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Unexpected server error.";

  if (err.name === "CastError") { statusCode = 400; message = "Invalid resource identifier."; }
  if (err.code === 11000) { statusCode = 409; message = "A record with that value already exists."; }
  if (err.name === "ValidationError") { statusCode = 400; message = Object.values(err.errors).map((item) => item.message).join(" "); }
  if (err.code === "LIMIT_FILE_SIZE") { statusCode = 413; message = "Image must be 5 MB or smaller."; }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
