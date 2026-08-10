const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");

// TODO(intern): build these out per docs/assignment-brief.md Section 6, then mount them:
// router.use("/auth", require("./auth.routes"));
// router.use("/customers", require("./customers.routes"));
// router.use("/jobs", require("./jobs.routes"));
// router.use("/dashboard", require("./dashboard.routes"));

router.use("/auth", authRoutes);

module.exports = router;