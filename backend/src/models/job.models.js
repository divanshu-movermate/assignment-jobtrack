const mongoose = require("mongoose");

const JOBSTATUSES = [
  "quote_requested",
  "quoted",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const jobSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    dropoffAddress: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    estimatedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    finalPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    status: {
      type: String,
      enum: JOB_STATUSES,
      default: "quote_requested",
    },
    assignedCrew: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    notes: {
      type: [noteSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


jobSchema.index({ status: 1 });
jobSchema.index({ scheduledDate: 1 });
jobSchema.index({ assignedCrew: 1 });
jobSchema.index({ customer: 1 });


jobSchema.statics.STATUSES = JOB_STATUSES;

module.exports = mongoose.model("Job", jobSchema);