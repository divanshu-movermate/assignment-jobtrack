const Job = require("../models/job.models");
const Customer = require("../models/customer.models");
const User = require("../models/user.models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { isValidTransition } = require("../utils/statusTransitions");
const { validatedQuery } = require("../middleware/validate")

// GET /api/jobs?search=&status=&assignedTo=&sort=&page=&limit=
// search matches customer name/email. We resolve matching Customer _ids
// first (populate-aware path, same call as Section 6's "your call, document
// which you picked" note), then filter Jobs by customer: { $in: [...] }.
// This combines cleanly with status/assignedTo filters in one Mongo query —
// no fetch-all-then-filter-in-JS anywhere in this function.
const listJobs = asyncHandler(async (req, res) => {
  const { search, status, assignedTo, sort, page, limit } = req.validatedQuery;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (assignedTo) {
    filter.assignedCrew = assignedTo;
  }

  if (search) {
    const pattern = new RegExp(search, "i");
    const matchingCustomers = await Customer.find({
      $or: [{ name: pattern }, { email: pattern }],
    }).select("_id");

    const customerIds = matchingCustomers.map((c) => c._id);

    if (customerIds.length === 0) {
      // No customer matches the search term at all — short-circuit with an
      // empty page rather than running a Job query that can't match anything.
      return res.status(200).json({
        success: true,
        data: {
          jobs: [],
          pagination: { page, limit, total: 0, totalPages: 1 },
        },
      });
    }

    filter.customer = { $in: customerIds };
  }

  const [sortField, sortDir] = sort.split(":");
  const sortObj = { [sortField]: sortDir === "asc" ? 1 : -1 };

  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("customer", "name email phone")
      .populate("assignedCrew", "name email")
      .sort(sortObj)
      .skip(skip)
      .limit(limit),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

// POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  const { customer, pickupAddress, dropoffAddress, scheduledDate, estimatedPrice } = req.body;

  const customerExists = await Customer.exists({ _id: customer });
  if (!customerExists) {
    throw new ApiError(404, "Customer not found");
  }

  const job = new Job({
    customer,
    pickupAddress,
    dropoffAddress,
    scheduledDate,
    estimatedPrice,
    createdBy: req.user.id,
    // status defaults to "quote_requested" on the model — not settable here
  });
  await job.save();
  await job.populate("customer", "name email phone");

  res.status(201).json({ success: true, data: { job } });
});

// GET /api/jobs/:id
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("customer")
    .populate("assignedCrew", "name email role")
    .populate("notes.author", "name email");

  if (!job) {
    throw new ApiError(404,"Job not found");
  }

  res.status(200).json({ success: true, data: { job } });
});

// PATCH /api/jobs/:id — general field updates. status/assignedCrew excluded
// by the zod schema, so they can never sneak in through this route.
const updateJob = asyncHandler(async (req, res) => {
  if (req.body.customer) {
    const customerExists = await Customer.exists({ _id: req.body.customer });
    if (!customerExists) {
      throw new ApiError(404, "Customer not found");
    }
  }

  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("customer", "name email phone");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res.status(200).json({ success: true, data: { job } });
});

// PATCH /api/jobs/:id/status — the Section 5.4 business logic. This is the
// ONLY route that may change a job's status, and it always runs the
// transition check server-side regardless of what the UI already hid.
const updateJobStatus = asyncHandler(async (req, res) => {
  const { status: nextStatus } = req.body;

  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (!isValidTransition(job.status, nextStatus)) {
    throw new ApiError(
        400,
      `Cannot move a job from "${job.status}" to "${nextStatus}"`
    );
  }

  job.status = nextStatus;
  await job.save();
  await job.populate("customer", "name email phone");

  res.status(200).json({ success: true, data: { job } });
});

// POST /api/jobs/:id/notes
const addNote = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  job.notes.push({ text, author: req.user.id, createdAt: new Date() });
  await job.save();
  await job.populate("notes.author", "name email");

  res.status(201).json({ success: true, data: { notes: job.notes } });
});

// POST /api/jobs/:id/assign — admin only (enforced at the route level)
const assignCrew = asyncHandler(async (req, res) => {
  const { assignedCrew } = req.body;

  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (assignedCrew.length > 0) {
    // Verify every id is a real user with role "staff" per the model's intent
    // (assignedCrew: ObjectId[] (User, role=staff)) — catches typos/bad ids
    // and someone trying to assign an admin as crew.
    const staffCount = await User.countDocuments({
      _id: { $in: assignedCrew },
      role: "staff",
    });
    if (staffCount !== assignedCrew.length) {
      throw new ApiError(400, "One or more assigned users are invalid or not staff");
    }
  }

  job.assignedCrew = assignedCrew;
  await job.save();
  await job.populate("assignedCrew", "name email");

  res.status(200).json({ success: true, data: { job } });
});

// DELETE /api/jobs/:id — admin only (enforced at the route level)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  res.status(200).json({ success: true, data: { message: "Job deleted" } });
});

module.exports = {
  listJobs,
  createJob,
  getJob,
  updateJob,
  updateJobStatus,
  addNote,
  assignCrew,
  deleteJob,
};