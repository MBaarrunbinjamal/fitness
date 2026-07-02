// controllers/dashboard/progressAnalytics.js
const { ObjectId } = require('mongodb');

exports.getProgressAnalytics = async (req, res) => {
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
                weightData
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};