const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const dashboardController = require("../controllers/dashboard.controllers");

// Judgment call (Section 8, "your call — either hide the page from nav for
// staff, or show it read-only; note which you picked and why"): the backend
// allows any authenticated user (admin or staff) to read stats — the data
// isn't sensitive per-user, it's aggregate counts. The frontend decides
// whether staff even sees the /dashboard nav link. Keeping the *endpoint*
// open to both roles avoids duplicating a role check that has no real
// security purpose here (unlike delete/assign, this route can't mutate
// anything or expose one user's private data to another).
router.get("/stats", authenticate, dashboardController.getStats);

module.exports = router;