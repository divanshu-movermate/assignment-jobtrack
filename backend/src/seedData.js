const staffData = [
  { name: "Arjun Mehta", email: "arjun@jobtrack.com", password: "staff123", role: "staff" },
  { name: "Priya Sharma", email: "priya@jobtrack.com", password: "staff123", role: "staff" },
  { name: "Rohan Verma", email: "rohan@jobtrack.com", password: "staff123", role: "staff" },
  { name: "Ananya Iyer", email: "ananya@jobtrack.com", password: "staff123", role: "staff" },
  { name: "Karan Singh", email: "karan@jobtrack.com", password: "staff123", role: "staff" },
];

const adminData = {
  name: "Admin",
  email: "admin@jobtrack.com",
  password: "admin123",
  role: "admin",
};

const customerData = [
  { name: "Ganesh Traders", city: "Mumbai", state: "Maharashtra", zip: "400001", phone: "98200 11223" },
  { name: "Shree Balaji Enterprises", city: "Pune", state: "Maharashtra", zip: "411001", phone: "98230 44556" },
  { name: "Kavya Interiors", city: "Bengaluru", state: "Karnataka", zip: "560001", phone: "99001 22334" },
  { name: "Delhi Fresh Mart", city: "New Delhi", state: "Delhi", zip: "110001", phone: "98111 55667" },
  { name: "Chennai Textile House", city: "Chennai", state: "Tamil Nadu", zip: "600001", phone: "94440 77889" },
  { name: "Hyderabad Auto Works", city: "Hyderabad", state: "Telangana", zip: "500001", phone: "90000 99887" },
  { name: "Jaipur Handicrafts Co.", city: "Jaipur", state: "Rajasthan", zip: "302001", phone: "94140 33221" },
  { name: "Kolkata Book Depot", city: "Kolkata", state: "West Bengal", zip: "700001", phone: "98300 66778" },
  { name: "Ahmedabad Spice Traders", city: "Ahmedabad", state: "Gujarat", zip: "380001", phone: "99250 44332" },
  { name: "Lucknow Furniture Mart", city: "Lucknow", state: "Uttar Pradesh", zip: "226001", phone: "94150 88776" },
];

const jobDescriptions = [
  "2 BHK household shifting",
  "Office relocation - 20 workstations",
  "Piano and heavy furniture transport",
  "Godown/warehouse cleanout",
  "Appliance delivery - fridge and washing machine",
  "Full villa relocation",
  "Single item pickup - sofa set",
  "Inter-city relocation",
  "Small shop inventory move",
  "Ancestral home cleanout",
  "PG/hostel move-out",
  "Warehouse pallet transport",
  "Antique furniture careful handling",
  "1 BHK flat move",
  "Terrace/storeroom cleanout and haul",
];

const pickupAddresses = [
  "12 MG Road, Bengaluru, Karnataka",
  "45 Linking Road, Mumbai, Maharashtra",
  "78 Park Street, Kolkata, West Bengal",
  "23 Sector 17, Chandigarh",
  "56 Anna Salai, Chennai, Tamil Nadu",
];

const dropoffAddresses = [
  "9 Banjara Hills, Hyderabad, Telangana",
  "34 Civil Lines, Jaipur, Rajasthan",
  "67 Salt Lake, Kolkata, West Bengal",
  "18 Koramangala, Bengaluru, Karnataka",
  "5 CG Road, Ahmedabad, Gujarat",
];

const sampleNotes = [
  "Customer requested confirmation call before arrival.",
  "Fragile items included — extra padding needed.",
  "Access via service lift only, no direct parking.",
  "Customer will not be present, watchman has keys.",
  "Time-sensitive — must complete before 2 PM.",
  "Repeat customer, handle with priority scheduling.",
  "Narrow lane, only two-wheeler/small vehicle access.",
];

module.exports = {
  staffData,
  adminData,
  customerData,
  jobDescriptions,
  pickupAddresses,
  dropoffAddresses,
  sampleNotes,
};