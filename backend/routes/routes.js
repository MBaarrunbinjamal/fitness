// routes/routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const loginController = require('../controllers/authentication/login');
const registerController = require('../controllers/authentication/register');

// Register
router.post('/auth/register', registerController.register);

// Login
router.post('/auth/login', loginController.login);

// Logout (Protected)
router.post('/auth/logout', auth, loginController.logout);

// Test Route (Protected)
router.get('/auth/me', auth, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;