// controllers/user/user.js
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==================== PROFILE MANAGEMENT ====================

exports.getProfile = async (req, res) => {
    try {
        const db = req.db;
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(req.userId) },
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

exports.updateProfile = async (req, res) => {
    try {
        const db = req.db;
        const { fullName, gender, age, height, weight, fitnessGoal } = req.body;

        const updateData = {
            fullName,
            gender,
            age: parseInt(age),
            height: parseFloat(height),
            weight: parseFloat(weight),
            fitnessGoal,
            updatedAt: new Date()
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(req.userId) },
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
            message: 'Profile updated successfully',
            user: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        const db = req.db;
        const { avatarUrl } = req.body;

        if (!avatarUrl) {
            return res.status(400).json({
                success: false,
                message: 'Avatar URL is required'
            });
        }

        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(req.userId) },
            { $set: { profilePicture: avatarUrl, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        res.json({
            success: true,
            message: 'Avatar updated successfully',
            profilePicture: result.profilePicture
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const db = req.db;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new password are required'
            });
        }

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(req.userId) }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.collection('users').updateOne(
            { _id: new ObjectId(req.userId) },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const db = req.db;
        const { notifications, theme, unitSystem } = req.body;

        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(req.userId) },
            { $set: { 
                preferences: { notifications, theme, unitSystem },
                updatedAt: new Date()
            }},
            { returnDocument: 'after' }
        );

        res.json({
            success: true,
            message: 'Preferences updated',
            preferences: result.preferences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ==================== WORKOUT MANAGEMENT ====================

exports.createWorkout = async (req, res) => {
    try {
        const db = req.db;
        const { name, category, date, duration, caloriesBurned, exercises, tags } = req.body;

        const workout = {
            userId: new ObjectId(req.userId),
            name,
            category: category || 'general',
            date: date ? new Date(date) : new Date(),
            duration: parseInt(duration) || 0,
            caloriesBurned: parseInt(caloriesBurned) || 0,
            exercises: exercises || [],
            tags: tags || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('workouts').insertOne(workout);

        res.status(201).json({
            success: true,
            message: 'Workout created successfully',
            workout: { ...workout, _id: result.insertedId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getWorkouts = async (req, res) => {
    try {
        const db = req.db;
        const { category, startDate, endDate, search } = req.query;

        let filter = { userId: new ObjectId(req.userId) };

        if (category) filter.category = category;
        if (startDate) filter.date = { $gte: new Date(startDate) };
        if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        const workouts = await db.collection('workouts')
            .find(filter)
            .sort({ date: -1 })
            .toArray();

        res.json({
            success: true,
            workouts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getWorkoutById = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const workout = await db.collection('workouts').findOne({
            _id: new ObjectId(id),
            userId: new ObjectId(req.userId)
        });

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        res.json({
            success: true,
            workout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateWorkout = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { name, category, date, duration, caloriesBurned, exercises, tags } = req.body;

        const updateData = {
            name,
            category,
            date: date ? new Date(date) : undefined,
            duration: duration ? parseInt(duration) : undefined,
            caloriesBurned: caloriesBurned ? parseInt(caloriesBurned) : undefined,
            exercises,
            tags,
            updatedAt: new Date()
        };

        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        const result = await db.collection('workouts').findOneAndUpdate(
            { _id: new ObjectId(id), userId: new ObjectId(req.userId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        res.json({
            success: true,
            message: 'Workout updated successfully',
            workout: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteWorkout = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const result = await db.collection('workouts').deleteOne({
            _id: new ObjectId(id),
            userId: new ObjectId(req.userId)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        res.json({
            success: true,
            message: 'Workout deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const db = req.db;
        const categories = ['strength', 'cardio', 'flexibility', 'hiit', 'yoga', 'pilates', 'other'];
        
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getWorkoutStats = async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);

        const totalWorkouts = await db.collection('workouts').countDocuments({ userId });
        const totalDuration = await db.collection('workouts').aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: '$duration' } } }
        ]).toArray();

        const categoryStats = await db.collection('workouts').aggregate([
            { $match: { userId } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]).toArray();

        res.json({
            success: true,
            stats: {
                totalWorkouts,
                totalDuration: totalDuration[0]?.total || 0,
                categories: categoryStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ==================== NUTRITION MANAGEMENT ====================

exports.createNutrition = async (req, res) => {
    try {
        const db = req.db;
        const { mealType, date, items, notes } = req.body;

        const totalCalories = items?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0;
        const totalProtein = items?.reduce((sum, item) => sum + (item.protein || 0), 0) || 0;
        const totalCarbs = items?.reduce((sum, item) => sum + (item.carbs || 0), 0) || 0;
        const totalFat = items?.reduce((sum, item) => sum + (item.fat || 0), 0) || 0;

        const nutrition = {
            userId: new ObjectId(req.userId),
            mealType: mealType || 'snack',
            date: date ? new Date(date) : new Date(),
            items: items || [],
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat,
            notes: notes || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('nutrition').insertOne(nutrition);

        res.status(201).json({
            success: true,
            message: 'Nutrition logged successfully',
            nutrition: { ...nutrition, _id: result.insertedId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getNutrition = async (req, res) => {
    try {
        const db = req.db;
        const { mealType, startDate, endDate } = req.query;

        let filter = { userId: new ObjectId(req.userId) };

        if (mealType) filter.mealType = mealType;
        if (startDate) filter.date = { $gte: new Date(startDate) };
        if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };

        const nutrition = await db.collection('nutrition')
            .find(filter)
            .sort({ date: -1 })
            .toArray();

        res.json({
            success: true,
            nutrition
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getNutritionById = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const nutrition = await db.collection('nutrition').findOne({
            _id: new ObjectId(id),
            userId: new ObjectId(req.userId)
        });

        if (!nutrition) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
            });
        }

        res.json({
            success: true,
            nutrition
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateNutrition = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { mealType, date, items, notes } = req.body;

        const totalCalories = items?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0;
        const totalProtein = items?.reduce((sum, item) => sum + (item.protein || 0), 0) || 0;
        const totalCarbs = items?.reduce((sum, item) => sum + (item.carbs || 0), 0) || 0;
        const totalFat = items?.reduce((sum, item) => sum + (item.fat || 0), 0) || 0;

        const updateData = {
            mealType,
            date: date ? new Date(date) : undefined,
            items,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat,
            notes,
            updatedAt: new Date()
        };

        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        const result = await db.collection('nutrition').findOneAndUpdate(
            { _id: new ObjectId(id), userId: new ObjectId(req.userId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
            });
        }

        res.json({
            success: true,
            message: 'Nutrition updated successfully',
            nutrition: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteNutrition = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const result = await db.collection('nutrition').deleteOne({
            _id: new ObjectId(id),
            userId: new ObjectId(req.userId)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
            });
        }

        res.json({
            success: true,
            message: 'Nutrition deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getNutritionSummary = async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayNutrition = await db.collection('nutrition').find({
            userId,
            date: { $gte: today }
        }).toArray();

        const dailySummary = {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            meals: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
        };

        todayNutrition.forEach(n => {
            dailySummary.totalCalories += n.totalCalories || 0;
            dailySummary.totalProtein += n.totalProtein || 0;
            dailySummary.totalCarbs += n.totalCarbs || 0;
            dailySummary.totalFat += n.totalFat || 0;
            if (n.mealType) {
                dailySummary.meals[n.mealType] = (dailySummary.meals[n.mealType] || 0) + n.totalCalories;
            }
        });

        res.json({
            success: true,
            summary: dailySummary,
            entries: todayNutrition
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ==================== PROGRESS MANAGEMENT ====================

exports.createProgress = async (req, res) => {
    try {
        const db = req.db;
        const { date, weight, bodyMeasurements, performanceMetrics, notes } = req.body;

        const progress = {
            userId: new ObjectId(req.userId),
            date: date ? new Date(date) : new Date(),
            weight: parseFloat(weight) || 0,
            bodyMeasurements: bodyMeasurements || {},
            performanceMetrics: performanceMetrics || {},
            notes: notes || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('progress').insertOne(progress);

        res.status(201).json({
            success: true,
            message: 'Progress recorded successfully',
            progress: { ...progress, _id: result.insertedId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const db = req.db;
        const { startDate, endDate } = req.query;

        let filter = { userId: new ObjectId(req.userId) };
        if (startDate) filter.date = { $gte: new Date(startDate) };
        if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };

        const progress = await db.collection('progress')
            .find(filter)
            .sort({ date: -1 })
            .toArray();

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getProgressById = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const progress = await db.collection('progress').findOne({
            _id: new ObjectId(id),
            userId: new ObjectId(req.userId)
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress record not found'
            });
        }

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { date, weight, bodyMeasurements, performanceMetrics, notes } = req.body;

        const updateData = {
            date: date ? new Date(date) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            bodyMeasurements,
            performanceMetrics,
            notes,
            updatedAt: new Date()
        };

        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        const result = await db.collection('progress').findOneAndUpdate(
            { _id: new ObjectId(id), userId: new ObjectId(req.userId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Progress record not found'
            });
        }

        res.json({
            success: true,
            message: 'Progress updated successfully',
            progress: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ==================== ANALYTICS ====================

exports.getWorkoutAnalytics = async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        const { period = 'week' } = req.query;

        let startDate = new Date();
        if (period === 'week') startDate.setDate(startDate.getDate() - 7);
        else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
        else if (period === 'year') startDate.setFullYear(startDate.getFullYear() - 1);

        const workouts = await db.collection('workouts').find({
            userId,
            date: { $gte: startDate }
        }).toArray();

        const dailyWorkouts = {};
        workouts.forEach(w => {
            const date = w.date.toISOString().split('T')[0];
            if (!dailyWorkouts[date]) dailyWorkouts[date] = 0;
            dailyWorkouts[date]++;
        });

        res.json({
            success: true,
            analytics: {
                total: workouts.length,
                dailyWorkouts,
                categories: workouts.reduce((acc, w) => {
                    acc[w.category] = (acc[w.category] || 0) + 1;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getNutritionAnalytics = async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        const { period = 'week' } = req.query;

        let startDate = new Date();
        if (period === 'week') startDate.setDate(startDate.getDate() - 7);
        else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);

        const nutrition = await db.collection('nutrition').find({
            userId,
            date: { $gte: startDate }
        }).toArray();

        const dailyNutrition = {};
        nutrition.forEach(n => {
            const date = n.date.toISOString().split('T')[0];
            if (!dailyNutrition[date]) {
                dailyNutrition[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
            }
            dailyNutrition[date].calories += n.totalCalories || 0;
            dailyNutrition[date].protein += n.totalProtein || 0;
            dailyNutrition[date].carbs += n.totalCarbs || 0;
            dailyNutrition[date].fat += n.totalFat || 0;
        });

        res.json({
            success: true,
            analytics: {
                totalEntries: nutrition.length,
                dailyNutrition,
                averageCalories: nutrition.reduce((sum, n) => sum + (n.totalCalories || 0), 0) / (nutrition.length || 1)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getProgressAnalytics = async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);

        const progress = await db.collection('progress')
            .find({ userId })
            .sort({ date: 1 })
            .toArray();

        const weightData = progress.map(p => ({
            date: p.date.toISOString().split('T')[0],
            weight: p.weight
        }));

        res.json({
            success: true,
            analytics: {
                totalRecords: progress.length,
                weightData,
                currentWeight: progress[progress.length - 1]?.weight || 0,
                startWeight: progress[0]?.weight || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        const db = req.db;
        const userId = new ObjectId(req.userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Recent workouts (last 5)
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

        // Total counts
        const totalWorkouts = await db.collection('workouts').countDocuments({ userId });
        const totalNutrition = await db.collection('nutrition').countDocuments({ userId });

        res.json({
            success: true,
            dashboard: {
                recentWorkouts,
                todayNutrition,
                latestProgress: latestProgress[0] || null,
                stats: {
                    totalWorkouts,
                    totalNutrition,
                    todayCalories: todayNutrition.reduce((sum, n) => sum + (n.totalCalories || 0), 0)
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

// ==================== NOTIFICATIONS ====================

exports.getNotifications = async (req, res) => {
    try {
        const db = req.db;
        const notifications = await db.collection('notifications')
            .find({ userId: new ObjectId(req.userId) })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const result = await db.collection('notifications').findOneAndUpdate(
            { _id: new ObjectId(id), userId: new ObjectId(req.userId) },
            { $set: { isRead: true, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification marked as read',
            notification: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        const result = await db.collection('notifications').deleteOne({
            _id: new ObjectId(id),
            userId: new ObjectId(req.userId)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ==================== FOLLOWERS ====================

exports.followUser = async (req, res) => {
    try {
        const db = req.db;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const targetUserId = new ObjectId(userId);
        const currentUserId = new ObjectId(req.userId);

        // Check if already following
        const existing = await db.collection('followers').findOne({
            followerId: currentUserId,
            followingId: targetUserId
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Already following this user'
            });
        }

        const follow = {
            followerId: currentUserId,
            followingId: targetUserId,
            status: 'accepted',
            createdAt: new Date()
        };

        await db.collection('followers').insertOne(follow);

        res.json({
            success: true,
            message: 'User followed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const db = req.db;
        const { userId } = req.params;

        const result = await db.collection('followers').deleteOne({
            followerId: new ObjectId(req.userId),
            followingId: new ObjectId(userId)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Follow relationship not found'
            });
        }

        res.json({
            success: true,
            message: 'Unfollowed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const db = req.db;
        const followers = await db.collection('followers')
            .aggregate([
                { $match: { followingId: new ObjectId(req.userId) } },
                { $lookup: {
                    from: 'users',
                    localField: 'followerId',
                    foreignField: '_id',
                    as: 'follower'
                }},
                { $unwind: '$follower' },
                { $project: {
                    follower: { password: 0 }
                }}
            ])
            .toArray();

        res.json({
            success: true,
            followers: followers.map(f => f.follower)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const db = req.db;
        const following = await db.collection('followers')
            .aggregate([
                { $match: { followerId: new ObjectId(req.userId) } },
                { $lookup: {
                    from: 'users',
                    localField: 'followingId',
                    foreignField: '_id',
                    as: 'following'
                }},
                { $unwind: '$following' },
                { $project: {
                    following: { password: 0 }
                }}
            ])
            .toArray();

        res.json({
            success: true,
            following: following.map(f => f.following)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};