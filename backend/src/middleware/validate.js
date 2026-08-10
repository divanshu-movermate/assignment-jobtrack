function validate(schema) {
  return function (req, res, next) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data; // req.body is safely writable, this part is fine
    next();
  };
}

function validateQuery(schema) {
  return function (req, res, next) {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      });
    }
    req.validatedQuery = result.data; // ✅ use a separate property, don't reassign req.query
    next();
  };
}

module.exports = { validate, validateQuery };