// routes/routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminauth');
const { ObjectId } = require('mongodb');

console.log('✅ routes.js loaded successfully!');

// Import Controllers
const loginController = require('../controllers/authentication/login');
const registerController = require('../controllers/authentication/register');
const userController = require('../controllers/user/user');
const adminController = require('../controllers/admin/admin');

// ============================================================
// ✅ DASHBOARD ROUTES
// ============================================================

router.get('/analytics/dashboard', auth, async (req, res) => {
    console.log('✅✅✅ DASHBOARD ROUTE HIT!');
    console.log('👤 User ID:', req.userId);
    
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Recent Workouts
        const recentWorkouts = await db.collection('workouts')
            .find({ userId })
            .sort({ date: -1 })
            .limit(5)
            .toArray();
        console.log('📊 Recent Workouts:', recentWorkouts.length);

        // 2. Today's Nutrition
        const todayNutrition = await db.collection('nutrition')
            .find({ userId, date: { $gte: today } })
            .toArray();
        console.log('📊 Today Nutrition:', todayNutrition.length);

        // 3. Latest Progress
        const latestProgress = await db.collection('progress')
            .find({ userId })
            .sort({ date: -1 })
            .limit(1)
            .toArray();
        console.log('📊 Latest Progress:', latestProgress.length);

        // 4. Stats
        const totalWorkouts = await db.collection('workouts').countDocuments({ userId });
        const totalNutrition = await db.collection('nutrition').countDocuments({ userId });
        console.log('📊 Total Workouts:', totalWorkouts);
        console.log('📊 Total Nutrition:', totalNutrition);

        // ✅ FINAL RESPONSE
        const dashboardData = {
            recentWorkouts: recentWorkouts || [],
            todayNutrition: todayNutrition || [],
            latestProgress: latestProgress[0] || null,
            stats: {
                totalWorkouts: totalWorkouts || 0,
                totalNutrition: totalNutrition || 0,
                todayCalories: todayNutrition.reduce((sum, n) => sum + (n.totalCalories || 0), 0) || 0
            }
        };

        res.json({
            success: true,
            dashboard: dashboardData
        });

    } catch (error) {
        console.error('❌ Dashboard Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/analytics/workouts', auth, async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        
        const workouts = await db.collection('workouts')
            .find({ userId })
            .toArray();
        
        const categoryStats = {};
        workouts.forEach(w => {
            categoryStats[w.category] = (categoryStats[w.category] || 0) + 1;
        });

        res.json({
            success: true,
            analytics: {
                total: workouts.length,
                categories: categoryStats,
                workouts: workouts.slice(0, 10)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/analytics/nutrition', auth, async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        
        const nutrition = await db.collection('nutrition')
            .find({ userId })
            .toArray();
        
        const mealTypeStats = {};
        nutrition.forEach(n => {
            mealTypeStats[n.mealType] = (mealTypeStats[n.mealType] || 0) + 1;
        });

        res.json({
            success: true,
            analytics: {
                total: nutrition.length,
                mealTypes: mealTypeStats,
                nutrition: nutrition.slice(0, 10)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/analytics/progress', auth, async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        
        const progress = await db.collection('progress')
            .find({ userId })
            .sort({ date: 1 })
            .toArray();

        const weightData = progress.map(p => ({
            date: p.date,
            weight: p.weight
        }));

        res.json({
            success: true,
            analytics: {
                total: progress.length,
                currentWeight: progress[progress.length - 1]?.weight || 0,
                startWeight: progress[0]?.weight || 0,
                weightData: weightData
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================
// AUTH ROUTES
// ============================================================
router.post('/auth/register', registerController.register);
router.post('/auth/login', loginController.login);
router.post('/auth/logout', auth, loginController.logout);

// ============================================================
// USER PROFILE ROUTES
// ============================================================
router.get('/users/profile', auth, userController.getProfile);
router.put('/users/profile', auth, userController.updateProfile);
router.post('/users/avatar', auth, userController.uploadAvatar);
router.put('/users/password', auth, userController.changePassword);
router.put('/users/preferences', auth, userController.updatePreferences);

// ============================================================
// WORKOUT ROUTES
// ============================================================
router.post('/workouts', auth, userController.createWorkout);
router.get('/workouts', auth, userController.getWorkouts);
router.get('/workouts/:id', auth, userController.getWorkoutById);
router.put('/workouts/:id', auth, userController.updateWorkout);
router.delete('/workouts/:id', auth, userController.deleteWorkout);
router.get('/workouts/categories', auth, userController.getCategories);
router.get('/workouts/stats', auth, userController.getWorkoutStats);

// ============================================================
// NUTRITION ROUTES
// ============================================================
router.post('/nutrition', auth, userController.createNutrition);
router.get('/nutrition', auth, userController.getNutrition);
router.get('/nutrition/:id', auth, userController.getNutritionById);
router.put('/nutrition/:id', auth, userController.updateNutrition);
router.delete('/nutrition/:id', auth, userController.deleteNutrition);
router.get('/nutrition/summary', auth, userController.getNutritionSummary);

// ============================================================
// PROGRESS ROUTES
// ============================================================
router.post('/progress', auth, userController.createProgress);
router.get('/progress', auth, userController.getProgress);
router.get('/progress/:id', auth, userController.getProgressById);
router.put('/progress/:id', auth, userController.updateProgress);

// ============================================================
// NOTIFICATION ROUTES
// ============================================================
router.get('/notifications', auth, userController.getNotifications);
router.put('/notifications/:id/read', auth, userController.markNotificationRead);
router.delete('/notifications/:id', auth, userController.deleteNotification);

// ============================================================
// FOLLOWER ROUTES
// ============================================================
router.post('/followers', auth, userController.followUser);
router.delete('/followers/:userId', auth, userController.unfollowUser);
router.get('/followers', auth, userController.getFollowers);
router.get('/following', auth, userController.getFollowing);

// ============================================================
// ADMIN ROUTES
// ============================================================
router.get('/admin/users', auth, adminAuth, adminController.getAllUsers);
router.get('/admin/users/:id', auth, adminAuth, adminController.getUserById);
router.put('/admin/users/:id', auth, adminAuth, adminController.updateUser);
router.delete('/admin/users/:id', auth, adminAuth, adminController.deleteUser);
router.get('/admin/stats', auth, adminAuth, adminController.getSystemStats);
router.get('/admin/activities', auth, adminAuth, adminController.getActivities);
router.put('/admin/users/:id/role', auth, adminAuth, adminController.changeUserRole);
router.put('/admin/users/:id/status', auth, adminAuth, adminController.toggleUserStatus);

module.exports = router;