const jobModels = require("../models/job.models");
const Job = require("../models/job.models");

// The single source of truth for Section 5.4's pipeline rules.
// Forward path: quote_requested -> quoted -> confirmed -> in_progress -> completed
// cancelled is reachable from any state except completed.
// completed and cancelled are terminal — nothing is valid from either.
const VALID_TRANSITIONS = {
  quote_requested: ["quoted", "cancelled"],
  quoted: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

function isValidTransition(currentStatus, nextStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

function getValidNextStatuses(currentStatus) {
  return VALID_TRANSITIONS[currentStatus] || [];
}

module.exports = {
  VALID_TRANSITIONS,
  isValidTransition,
  getValidNextStatuses,
  ALL_STATUSES: Job.Statuses, // re-exported for convenience where only the enum is needed
};