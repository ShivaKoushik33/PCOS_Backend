const express = require("express");
const { predict } = require("../controllers/predictController");

const router = express.Router();

// Define POST route for predictions
router.post("/", predict);

module.exports = router;
