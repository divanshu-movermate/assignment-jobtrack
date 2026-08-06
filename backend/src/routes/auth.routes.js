const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { loginSchema, createUserSchema} = require("../schemas/auth.schemas");
const authController = require("../controllers/authController");



router.post("/login", validate(loginSchema), authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/me", authenticate, authController.meUser);
router.post(
  "/users",
  authenticate,
  authorize("admin"),
  validate(createUserSchema),
  authController.createUser
);

module.exports = router;
