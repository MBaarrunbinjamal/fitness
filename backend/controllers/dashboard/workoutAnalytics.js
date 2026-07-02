// controllers/dashboard/workoutAnalytics.js
const { ObjectId } = require('mongodb');

exports.getWorkoutAnalytics = async (req, res) => {
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
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};