const Job = require("../models/job.models");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
  const now = new Date();

  const startOfThisMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const [result] = await Job.aggregate([
    {
      $facet: {
        // 1. Count jobs per status
        statusCounts: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        // 2. Pipeline revenue
        pipelineRevenue: [
          {
            $match: {
              status: { $ne: "cancelled" },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$estimatedPrice" },
            },
          },
        ],

        // 3. Jobs this month
        jobsThisMonth: [
          {
            $match: {
              createdAt: {
                $gte: startOfThisMonth,
                $lt: startOfNextMonth,
              },
            },
          },
          {
            $count: "count",
          },
        ],

        // 4. Jobs last month
        jobsLastMonth: [
          {
            $match: {
              createdAt: {
                $gte: startOfLastMonth,
                $lt: startOfThisMonth,
              },
            },
          },
          {
            $count: "count",
          },
        ],

        // 5. Top 3 customers
        topCustomers: [
          {
            $group: {
              _id: "$customer",
              jobCount: { $sum: 1 },
            },
          },
          {
            $sort: {
              jobCount: -1,
            },
          },
          {
            $limit: 3,
          },
          {
            $lookup: {
              from: "customers",
              localField: "_id",
              foreignField: "_id",
              as: "customer",
            },
          },
          {
            $unwind: "$customer",
          },
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

  // All possible job statuses
  const JOB_STATUSES = [
    "quote_requested",
    "quoted",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
  ];

  // Initialize all statuses with 0
  const statusCounts = Object.fromEntries(
    JOB_STATUSES.map((status) => [status, 0])
  );

  // Add actual counts from MongoDB
  for (const { _id, count } of result.statusCounts) {
    statusCounts[_id] = count;
  }

  const pipelineRevenue =
    result.pipelineRevenue[0]?.total || 0;

  const jobsThisMonth =
    result.jobsThisMonth[0]?.count || 0;

  const jobsLastMonth =
    result.jobsLastMonth[0]?.count || 0;

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