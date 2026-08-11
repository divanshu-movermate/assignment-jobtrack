const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const customerRoutes = require("./customer.routes")
const jobRoutes = require("./job.routes")
const dashboardRoutes = require("./dashboard.routes")

// TODO(intern): build these out per docs/assignment-brief.md Section 6, then mount them:
// router.use("/auth", require("./auth.routes"));
// router.use("/customers", require("./customers.routes"));
// router.use("/jobs", require("./jobs.routes"));
// router.use("/dashboard", require("./dashboard.routes"));

router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);
router.use("/jobs", jobRoutes);
router.use("/dashboard", dashboardRoutes);


module.exports = router;