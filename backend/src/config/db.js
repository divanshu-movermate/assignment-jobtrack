
const mongoose = require("mongoose");
const DB_NAME = require(".././constants")
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


async function connectDB() {
  try {
    console.log("MONGO URI:", process.env.MONGO_URI);
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
