// controllers/dashboard/nutritionAnalytics.js
const { ObjectId } = require('mongodb');

exports.getNutritionAnalytics = async (req, res) => {
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
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};