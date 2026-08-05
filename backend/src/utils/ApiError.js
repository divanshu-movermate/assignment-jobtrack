// Throw this from anywhere (controllers, middleware) to produce a clean
// { success: false, error: message } response with the right status code.
// Anything thrown that ISN'T an ApiError is treated as a 500 by errorHandler.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
