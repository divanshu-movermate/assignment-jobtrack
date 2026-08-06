const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    line1: {
        type: String,
        trim: true,
        default: "" 
    },
    city: {
        type: String,
        trim: true,
        default: "" 
    },
    state: {
        type: String,
        trim: true,
        default: ""
    },
    zip: {
        type: String,
        trim: true,
        default: "" 
    },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: addressSchema,
      default: () => ({}),
    },
    notes: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Supports GET /api/customers?search= matching on name/email
customerSchema.index({ name: "text", email: "text" });

module.exports = mongoose.model("Customer", customerSchema);