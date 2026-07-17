const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Require controllers
const loginController = require('../controllers/authentication/login');
const registerController = require('../controllers/authentication/register');
const verifyEmailController = require('../controllers/authentication/verifyEmail');
const forgotPasswordController = require('../controllers/authentication/forgotPassword');
var adminController = require('../controllers/admin/admin');
const userController = require('../controllers/user/user');
const {
    createNutritionLog,
    getTodayNutrition,
    getNutritionByDate,
    deleteNutritionLog
} = require("../controllers/user/nutritionController");
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
router.post('/workouts', userController.createWorkout);
router.get('/workouts', userController.getWorkouts);
router.get('/workouts/:id', userController.getSingleWorkout);
router.put('/workouts/:id', userController.updateWorkout);
router.delete('/workouts/:id', userController.deleteWorkout);

// Get Current User (Protected)
router.get('/auth/me', auth, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// User Routes
router.get('/getuser', auth,userController.getUser);
router.put('/update', auth, userController.upload.single('profilePicture'), userController.updateUser);

router.post('/subscribe',  userController.subscribe);
router.get('/my-workout-plan',  userController.getMyWorkoutPlan);
router.get('/subscription-plans', userController.getsubscriptionPlans);
router.get('/subscription-plans/:id', userController.getsinglesubscriptionPlan);
//nutrition routes
router.post("/nutrition", auth, createNutritionLog);

// Get today's nutrition
router.get("/nutrition/today", auth, getTodayNutrition);

// Get nutrition by date
router.get("/nutrition/date/:date", auth, getNutritionByDate);

// Delete nutrition log
router.delete("/nutrition/:id", auth, deleteNutritionLog);//admin routes
router.get('/admin/users',   adminController.getAllUsers);
router.delete('/admin/users/:id',   adminController.deleteUser);
router.get('/admin/requests',   adminController.getworkoutRequests);
router.post('/admin/requests/:id/accept',   adminController.acceptrequest);
router.post('/admin/requests/:id/reject',   adminController.rejectrequest);
router.post('/admin/subscriptions/:id/plan',   adminController.uploadWorkoutPlan);
router.post('/admin/subscription-plans',   adminController.addsubscriptionPlan);

module.exports = router;