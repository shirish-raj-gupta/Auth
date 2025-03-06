const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { verifyToken } = require('../controllers/verifyController');

const router = express.Router();

// ✅ Email Verification Route (GET method is fine)
router.get('/verify/:token', verifyToken);

// ✅ Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
