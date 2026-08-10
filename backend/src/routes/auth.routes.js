const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {validate} = require("../middleware/validate");
const { loginSchema, createUserSchema} = require("../schemas/auth.schemas");
const authController = require("../controllers/auth.controllers");




router.post("/login", validate(loginSchema), authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/dashboard", authenticate, authController.meUser);
router.post(
  "/users",
  authenticate,
  authorize("admin"),
  validate(createUserSchema),
  authController.createUser
);

router.get(
  "/staff",
  authenticate,
  authorize("admin"),
  authController.listStaffWithJobs
);




module.exports = router;
