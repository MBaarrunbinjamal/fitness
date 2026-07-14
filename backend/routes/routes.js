const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Require controllers
const workoutController = require('../controllers/workout/workoutController');
const loginController = require('../controllers/authentication/login');
const registerController = require('../controllers/authentication/register');
const verifyEmailController = require('../controllers/authentication/verifyEmail');
const forgotPasswordController = require('../controllers/authentication/forgotPassword');
const { getUser, updateUser, upload } = require('../controllers/user/user');

// Register
router.post('/auth/register', registerController.register);

// Login
router.post('/auth/login', loginController.login);

// Logout
router.post('/auth/logout', auth, loginController.logout);

// Verify Email
router.get('/auth/verify-email', verifyEmailController.verifyEmail);

// Resend Verification
router.post('/auth/resend-verification', verifyEmailController.resendVerification);

// Forgot Password
router.post('/auth/forgot-password', forgotPasswordController.forgotPassword);

// Reset Password
router.post('/auth/reset-password', forgotPasswordController.resetPassword);

// Workout Routes
router.post('/workouts', workoutController.createWorkout);
router.get('/workouts', workoutController.getWorkouts);
router.get('/workouts/:id', workoutController.getSingleWorkout);
router.put('/workouts/:id', workoutController.updateWorkout);
router.delete('/workouts/:id', workoutController.deleteWorkout);

// Get Current User (Protected)
router.get('/auth/me', auth, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// User Routes
router.get('/getuser', auth, getUser);
router.put('/update', auth, upload.single('profilePicture'), updateUser);

module.exports = router;