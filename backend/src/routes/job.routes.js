const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { validate, validateQuery } = require("../middleware/validate");
const {
  createJobSchema,
  updateJobSchema,
  updateStatusSchema,
  addNoteSchema,
  assignCrewSchema,
  listJobsQuerySchema,
} = require("../schemas/jobs.schemas");
const jobController = require("../controllers/job.controllers");

// Every route below requires a logged-in user (admin or staff).
// assign and delete are further restricted to admin — matches
router.use(authenticate);

router.get("/", validateQuery(listJobsQuerySchema), jobController.listJobs);

router.post("/", validate(createJobSchema), jobController.createJob);

router.get("/:id", jobController.getJob);

router.patch("/:id", validate(updateJobSchema), jobController.updateJob);

router.patch(
  "/:id/status",
  validate(updateStatusSchema),
  jobController.updateJobStatus
);

router.post("/:id/notes", validate(addNoteSchema), jobController.addNote);

router.post(
  "/:id/assign",
  authorize("admin"),
  validate(assignCrewSchema),
  jobController.assignCrew
);

router.delete("/:id", authorize("admin"), jobController.deleteJob);

module.exports = router;