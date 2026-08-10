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
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/user.models");
const Customer = require("./models/customer.models");
const Job = require("./models/job.models");
const {
  staffData,
  adminData,
  customerData,
  jobDescriptions,
  pickupAddresses,
  dropoffAddresses,
  sampleNotes,
} = require("./seedData");

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinDays(days) {
  const offset = Math.floor(Math.random() * days) * 86400000;
  return new Date(Date.now() + offset);
}

async function seed(){
  await connectDB();

  console.log("Wiping existing Users, Customers, Jobs...");
  await User.deleteMany({});
  await Customer.deleteMany({});
  await Job.deleteMany({});

  console.log("Creating admin user...");
  const admin = await User.create(adminData);
  console.log(`  → Admin: ${admin.email} / password: admin123`);

  console.log("Creating staff users...");
  const staff = await User.create(staffData);
  console.log(`  → ${staff.length} staff users created`);

  console.log("Creating customers...");
  const customers = await Customer.create(
    customerData.map((c, i) => ({
      name: c.name,
      email: `contact${i + 1}@${c.name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      phone: c.phone,
      address: {
        line1: `${100 + i} Main St`,
        city: c.city,
        state: c.state,
        zip: c.zip,
      },
      notes: i % 3 === 0 ? "Preferred customer, prioritize scheduling." : "",
      createdBy: admin._id,
    }))
  );
  console.log(`  → ${customers.length} customers created`);

  console.log("Creating jobs...");
  const jobsData = jobDescriptions.map(() => {
    const status = randomFrom(Job.Statuses);
    const crewCount = Math.floor(Math.random() * 3); // 0–2 crew
    const shuffledStaff = [...staff].sort(() => 0.5 - Math.random());
    const estimatedPrice = Math.floor(Math.random() * 800) + 100;

    return {
      customer: randomFrom(customers)._id,
      pickupAddress: randomFrom(pickupAddresses),
      dropoffAddress: randomFrom(dropoffAddresses),
      scheduledDate: randomDateWithinDays(30),
      estimatedPrice,
      finalPrice: status === "completed" ? estimatedPrice + Math.floor(Math.random() * 50) - 25 : null,
      status,
      assignedCrew: shuffledStaff.slice(0, crewCount).map((s) => s._id),
      notes:
        Math.random() > 0.5
          ? [{ text: randomFrom(sampleNotes), author: admin._id }]
          : [],
      createdBy: admin._id,
    };
  });

  const createdJobs = await Job.create(jobsData);
  console.log(`  → ${createdJobs.length} jobs created`);

  console.log("Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});