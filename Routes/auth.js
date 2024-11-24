const express = require('express');
const router = express.Router();
const authController = require('../Controller/authcontroller');
const dotenv = require('dotenv');
// In your app.js or server.js
dotenv.config();


router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);


module.exports = router;
