// Wrap async controllers so a rejected promise / thrown error is forwarded
// to next(err) automatically, instead of every controller needing its own
// try/catch. Usage: router.get("/", asyncHandler(controller.list));
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
