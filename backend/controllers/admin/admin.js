// controllers/admin/admin.js
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const db = req.db;
        const { search, role, status } = req.query;

        let filter = {};
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) filter.role = role;
        if (status) filter.status = status;

        const users = await db.collection('users')
            .find(filter, { projection: { password: 0 } })
            .sort({ createdAt: -1 })
            .toArray();

        const totalUsers = await db.collection('users').countDocuments();

        res.json({
            success: true,
            users,
            total: totalUsers,
            filtered: users.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { fullName, gender, age, height, weight, fitnessGoal, username, email } = req.body;

        const updateData = {
            fullName,
            gender,
            age: parseInt(age),
            height: parseFloat(height),
            weight: parseFloat(weight),
            fitnessGoal,
            username,
            email,
            updatedAt: new Date()
        };

        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        delete result.password;

        res.json({
            success: true,
            message: 'User updated successfully',
            user: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(id) }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin user'
            });
        }

        await db.collection('users').deleteOne({ _id: new ObjectId(id) });
        await db.collection('workouts').deleteMany({ userId: new ObjectId(id) });
        await db.collection('nutrition').deleteMany({ userId: new ObjectId(id) });
        await db.collection('progress').deleteMany({ userId: new ObjectId(id) });
        await db.collection('notifications').deleteMany({ userId: new ObjectId(id) });

        res.json({
            success: true,
            message: 'User and all associated data deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getSystemStats = async (req, res) => {
    try {
        const db = req.db;

        const [totalUsers, totalWorkouts, totalNutrition, totalProgress] = await Promise.all([
            db.collection('users').countDocuments(),
            db.collection('workouts').countDocuments(),
            db.collection('nutrition').countDocuments(),
            db.collection('progress').countDocuments()
        ]);

        // Active users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = await db.collection('workouts').distinct('userId', {
            date: { $gte: thirtyDaysAgo }
        });

        // Recent registrations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentRegistrations = await db.collection('users').countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalWorkouts,
                totalNutrition,
                totalProgress,
                activeUsers: activeUsers.length,
                recentRegistrations,
                registrationDate: {
                    from: sevenDaysAgo,
                    to: new Date()
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getActivities = async (req, res) => {
    try {
        const db = req.db;
        const { limit = 20 } = req.query;

        const recentWorkouts = await db.collection('workouts')
            .aggregate([
                { $sort: { createdAt: -1 } },
                { $limit: parseInt(limit) },
                { $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }},
                { $unwind: '$user' },
                { $project: {
                    type: 'workout',
                    username: '$user.username',
                    userImage: '$user.profilePicture',
                    action: 'completed a workout',
                    details: '$name',
                    timestamp: '$createdAt'
                }}
            ])
            .toArray();

        const recentRegistrations = await db.collection('users')
            .find({}, { sort: { createdAt: -1 }, limit: parseInt(limit) })
            .project({ username: 1, profilePicture: 1, createdAt: 1 })
            .toArray();

        const activities = [
            ...recentWorkouts.map(w => ({
                ...w,
                timestamp: w.timestamp || new Date()
            })),
            ...recentRegistrations.map(u => ({
                type: 'registration',
                username: u.username,
                userImage: u.profilePicture,
                action: 'joined the platform',
                details: 'New member',
                timestamp: u.createdAt
            }))
        ];

        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json({
            success: true,
            activities: activities.slice(0, parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.changeUserRole = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role must be either "user" or "admin"'
            });
        }

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(id) }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin' && role === 'user') {
            const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot remove the last admin'
                });
            }
        }

        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { role, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        delete result.password;

        res.json({
            success: true,
            message: 'User role updated successfully',
            user: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(id) }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
            if (adminCount <= 1 && user.status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot deactivate the last admin'
                });
            }
        }

        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { status: newStatus, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        delete result.password;

        res.json({
            success: true,
            message: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
            user: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};