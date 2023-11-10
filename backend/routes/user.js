const express = require("express");
const router = express.Router();
const validateUserInput = require("../middleware/validate-userInput");
const limiter = require("../middleware/rateLimit");

const userCtrl = require("../controllers/user");

// Définition des routes :
router.post("/signup", validateUserInput, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;
