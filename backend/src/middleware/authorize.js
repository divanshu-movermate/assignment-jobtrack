// RBAC middleware factory - not itself a middleware, a function that
// RETURNS one. authorize("admin") runs once when the route file loads and
// "remembers" allowedRoles; the function it returns runs on every request.
function authorize(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Not allowed to perform this action" });
    }
    next();
  };
}

module.exports = authorize;
