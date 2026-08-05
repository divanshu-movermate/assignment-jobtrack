// npm run seed
//
// TODO(intern): once the User/Customer/Job models exist, build this out per
// docs/assignment-brief.md Section 7:
//   - connect to Mongo (reuse config/db.js)
//   - wipe existing Users/Customers/Jobs (dev convenience, not required)
//   - create one admin user (hashed password)
//   - create ~10 customers
//   - create ~15 jobs in varied statuses, some with notes/assignedCrew
//   - disconnect and exit
require("dotenv").config();
const connectDB = require("./config/db");

async function seed() {
  await connectDB();
  console.log("TODO: seed admin user, customers, jobs");
  process.exit(0);
}

seed();
