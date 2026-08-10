const { success } = require("zod");
const User = require("../models/user.models");
const ApiResponse = require("../utils/ApiResponse")
const asyncHandler = require("../utils/asyncHandler")
const generateToken = require("../utils/generateToken");
const Job = require("../models/job.models");
const ApiError = require("../utils/ApiError");





const createUser = asyncHandler( async (req, res)=>{
    // res.status(200).json({
    //     message: 'ok'
    // })

    const {name, email, password, role} = req.body
    
    const existedUser = await User.findOne({ email });

    if(existedUser){
        throw new ApiError("Email already exist", 403)
    }


    const user = await User.create({
        name,
        email,
        password,
        role,
    })

    const createdUser = await User.findById(user._id)
    .select(
        "-password -refreshToken"
    )


    if(!createdUser){
      throw new ApiError("Something Went wrong while registering the user", 404)
    }

    return res.status(201).json(
       new ApiResponse(200, createdUser, "User Registered Successfully" )
    )
 });




 
// GET /api/users/staff?search=&page=&limit=
// Lists all staff users, each with their currently assigned jobs populated.
// search matches staff name/email. Same pattern as listJobs/listCustomers —
// filter first in Mongo, no fetch-all-then-filter-in-JS.
const listStaffWithJobs = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query;

  const filter = { role: "staff" };

  if (search) {
    const pattern = new RegExp(search, "i");
    filter.$or = [{ name: pattern }, { email: pattern }];
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

  // For each staff member, fetch their currently assigned jobs.
  // Jobs reference staff via assignedCrew: ObjectId[], so we look up jobs
  // where assignedCrew contains this user's _id.
  const staffWithJobs = await Promise.all(
    staff.map(async (member) => {
      const jobs = await Job.find({ assignedCrew: member._id })
        .select("pickupAddress dropoffAddress status scheduledDate estimatedPrice")
        .populate("customer", "name email")
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


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("User with email already exists.", 403)
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const token = generateToken({ _id: user._id, email: user.email, role: user.role });

  const loggedInUser = await User.findById(user._id)
  .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, token },
        "User logged in successfully"
      )
    );
});

const adminUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200,
         { user: req.user },
          `Welcome ${req.user.name} to Admin dashboard`)
  );
});

const meUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200,
         { user: req.user },
          `Welcome ${req.user.name} to personal dashboard`)
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200,{}, "User logged out successfully"));
});






module.exports = { loginUser, logoutUser, meUser, adminUser, createUser, listStaffWithJobs };