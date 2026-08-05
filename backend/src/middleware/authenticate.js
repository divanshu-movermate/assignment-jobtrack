const jwt = require("jsonwebtoken");

// Verifies the JWT (from an httpOnly cookie, or an Authorization: Bearer
// header as a fallback) and attaches the decoded payload to req.user.
// TODO(intern): once the User model exists, consider looking the user up by
// decoded.id instead of trusting the token payload directly - your call,
// note the tradeoff either way (see the brief's note on token storage).
function authenticate(req, res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = req.cookies?.token || bearer;

    if (!token) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

module.exports = authenticate;
