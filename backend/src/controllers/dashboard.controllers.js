const Job = require("../models/job.models");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/dashboard/stats
//
// Everything below is ONE round trip to Mongo via $facet — each key runs
// its own sub-pipeline against the same input documents, all in a single
// aggregate() call. This is the one endpoint the assignment specifically
// requires to use the aggregation framework rather than several queries
// stitched together in Node (Section 6 checklist item).
const getStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [result] = await Job.aggregate([
    {
      $facet: {
        // 1. Count of jobs per status
        statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],

        // 2. Sum of estimatedPrice for jobs not cancelled ("pipeline revenue")
        pipelineRevenue: [
          { $match: { status: { $ne: "cancelled" } } },
          { $group: { _id: null, total: { $sum: "$estimatedPrice" } } },
        ],

        // 3. Jobs created this month vs last month
        jobsThisMonth: [
          { $match: { createdAt: { $gte: startOfThisMonth, $lt: startOfNextMonth } } },
          { $count: "count" },
        ],
        jobsLastMonth: [
          { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
          { $count: "count" },
        ],

        // 4. Top 3 customers by job count
        topCustomers: [
          { $group: { _id: "$customer", jobCount: { $sum: 1 } } },
          { $sort: { jobCount: -1 } },
          { $limit: 3 },
          {
            $lookup: {
              from: "customers", // Mongoose's default pluralized collection name for the Customer model
              localField: "_id",
              foreignField: "_id",
              as: "customer",
            },
          },
          { $unwind: "$customer" },
          {
            $project: {
              _id: 0,
              customerId: "$customer._id",
              name: "$customer.name",
              email: "$customer.email",
              jobCount: 1,
            },
          },
        ],
      },
    },
  ]);

  // --- Shape the $facet output into a clean response -----------------------
  // Build a status-count map that always includes every status, even ones
  // with zero jobs, so the frontend doesn't need to guard against missing keys.
  const statusCounts = Object.fromEntries(Job.STATUSES.map((s) => [s, 0]));
  for (const { _id, count } of result.statusCounts) {
    statusCounts[_id] = count;
  }

  const pipelineRevenue = result.pipelineRevenue[0]?.total || 0;
  const jobsThisMonth = result.jobsThisMonth[0]?.count || 0;
  const jobsLastMonth = result.jobsLastMonth[0]?.count || 0;

  res.status(200).json({
    success: true,
    data: {
      statusCounts,
      pipelineRevenue,
      jobsThisMonth,
      jobsLastMonth,
      topCustomers: result.topCustomers,
    },
  });
});

module.exports = { getStats };