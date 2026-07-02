// controllers/dashboard/dashboard.js
const { ObjectId } = require('mongodb');

exports.getDashboardData = async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Recent workouts
        const recentWorkouts = await db.collection('workouts')
            .find({ userId })
            .sort({ date: -1 })
            .limit(5)
            .toArray();

        // Today's nutrition
        const todayNutrition = await db.collection('nutrition')
            .find({ userId, date: { $gte: today } })
            .toArray();

        // Latest progress
        const latestProgress = await db.collection('progress')
            .find({ userId })
            .sort({ date: -1 })
            .limit(1)
            .toArray();

        // Stats
        const totalWorkouts = await db.collection('workouts').countDocuments({ userId });
        const totalNutrition = await db.collection('nutrition').countDocuments({ userId });

        res.json({
            success: true,
            dashboard: {
                recentWorkouts: recentWorkouts || [],
                todayNutrition: todayNutrition || [],
                latestProgress: latestProgress[0] || null,
                stats: {
                    totalWorkouts: totalWorkouts || 0,
                    totalNutrition: totalNutrition || 0,
                    todayCalories: todayNutrition.reduce((sum, n) => sum + (n.totalCalories || 0), 0) || 0
                }
            }
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};