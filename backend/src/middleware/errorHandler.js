// Centralized error handler - controllers throw/next(err), they don't each
// need their own try/catch/response boilerplate. Must be mounted LAST,
// after all routes, per Express convention (4-arg signature is what makes
// Express treat this as an error handler).
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  // Never leak raw Mongoose/stack errors to the client.
  const message = statusCode === 500 && process.env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message;

  res.status(statusCode).json({ success: false, error: message });
}

module.exports = errorHandler;
