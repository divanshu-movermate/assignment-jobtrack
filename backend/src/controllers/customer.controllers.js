const ApiError = require("../utils/ApiError");
const Customer = require("../models/customer.models");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {validatedQuery} = require("../middleware/validate")

const listCustomers = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.validatedQuery;

  const filter = {};
  if (search) {
    const pattern = new RegExp(search, "i");
    filter.$or = [{ name: pattern }, { email: pattern }];
  }

  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      customers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    },
  });
});

const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address, notes } = req.body;

  const existedCustomer = await Customer.findOne({ email });

  if (existedCustomer) {
    throw new ApiError(409, "Customer already exists");
  }

  const customer = await Customer.create({
    name,
    email,
    phone,
    address,
    notes,
    createdBy: req.user._id, // schema requires this field
  });

  const createdCustomer = await Customer.findById(customer._id);

  if (!createdCustomer) {
    throw new ApiError(500, "Something went wrong while creating the customer");
  }

  return res.status(201).json(
    new ApiResponse(201, createdCustomer, "Customer created successfully")
  );
});

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }
  res.status(200).json({ success: true, data: { customer } });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res.status(200).json(
    new ApiResponse(200, customer, "Customer details updated successfully.")
  );
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }
  return res.status(200).json(
    new ApiResponse(200, {}, "Customer deleted successfully")
  );
});

module.exports = { listCustomers, createCustomer, getCustomer, updateCustomer, deleteCustomer };