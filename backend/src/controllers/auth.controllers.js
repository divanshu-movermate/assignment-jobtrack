const User = require("../models/user.models");
const Job = require("../models/job.models");

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");



// CREATE USER


const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(403, "Email already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      404,
      "Something Went wrong while registering the user"
    );
  }

  return res.status(201).json(
    new ApiResponse(
      200,
      createdUser,
      "User Registered Successfully"
    )
  );
});



// GET CURRENT USER PROFILE
// Works for BOTH admin and staff
// GET /api/auth/profile


const getProfile = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Not authenticated");
  }

  const userId = req.user._id;

  // Fetch current user
  const user = await User.findById(userId)
    .select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // IMPORTANT:
  // Do not depend on User.assignedJobs.
  //
  // Jobs actually store staff IDs inside assignedCrew.
  const assignedJobs = await Job.find({
    assignedCrew: userId,
  })
    .select(
      "_id customer pickupAddress dropoffAddress scheduledDate estimatedPrice status assignedCrew"
    )
    .populate("customer", "_id name email")
    .sort({ scheduledDate: -1 });

  const profile = {
    ...user.toObject(),
    assignedJobs,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: profile,
      },
      "Profile fetched successfully"
    )
  );
});


// ======================================================
// GET ALL TEAM
// ADMIN ONLY
// GET /api/auth/allteam
// ======================================================

const getAllTeam = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  const jobs = await Job.find({})
    .select(
      "_id customer pickupAddress dropoffAddress scheduledDate estimatedPrice status assignedCrew"
    )
    .populate("customer", "_id name email");

  const team = users.map((user) => {
    const assignedJobs = jobs.filter((job) =>
      job.assignedCrew?.some(
        (crewId) =>
          crewId.toString() === user._id.toString()
      )
    );

    return {
      ...user.toObject(),
      assignedJobs,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: team,
        pagination: {
          total: team.length,
          totalPages: 1,
        },
      },
      "All users fetched successfully"
    )
  );
});



// GET STAFF WITH JOBS
// ADMIN ONLY
// GET /api/auth/staff


const listStaffWithJobs = asyncHandler(async (req, res) => {
  const search = req.query.search || "";

  const page = Math.max(
    parseInt(req.query.page || "1", 10),
    1
  );

  const limit = Math.max(
    parseInt(req.query.limit || "10", 10),
    1
  );

  const filter = {
    role: "staff",
  };

  if (search) {
    const pattern = new RegExp(search, "i");

    filter.$or = [
      { name: pattern },
      { email: pattern },
    ];
  }

  const skip = (page - 1) * limit;

  const [staff, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(filter),
  ]);

  const staffWithJobs = await Promise.all(
    staff.map(async (member) => {
      const jobs = await Job.find({
        assignedCrew: member._id,
      })
        .select(
          "_id customer pickupAddress dropoffAddress scheduledDate estimatedPrice status assignedCrew"
        )
        .populate("customer", "_id name email")
        .sort({ scheduledDate: 1 });

      return {
        ...member.toObject(),
        assignedJobs: jobs,
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        staff: staffWithJobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      "Staff list fetched successfully"
    )
  );
});



// LOGIN


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      403,
      "User with email doesn't exists."
    );
  }

  const isPasswordValid =
    await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  }

  const token = generateToken({
    _id: user._id,
    email: user.email,
    role: user.role,
  });

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          token,
        },
        "User logged in successfully"
      )
    );
});



// ADMIN DASHBOARD
// ADMIN ONLY


const adminUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
      },
      `Welcome ${req.user.name} to Admin dashboard`
    )
  );
});



// STAFF DASHBOARD
// AUTHENTICATED USERS


const meUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
      },
      `Welcome ${req.user.name} to personal dashboard`
    )
  );
});



// LOGOUT


const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(
      new ApiResponse(
        200,
        {},
        "User logged out successfully"
      )
    );
});


module.exports = {
  loginUser,
  logoutUser,
  meUser,
  adminUser,
  createUser,
  listStaffWithJobs,
  getAllTeam,
  getProfile,
};