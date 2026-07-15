const path = require('path');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');

var auth = require('../../middleware/auth');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/profile-pics';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
    }
};

const upload = multer({
    storage: diskStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

async function getUser(req, res) {
    try {
        return res.json({ success: true, user: req.user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

async function updateUser(req, res) {
    try {
        const db = req.db;
        const userId = req.user._id;

        const {
            username,
            fullName,
            height,
            weight,
            dateOfBirth,
            gender,
            fitnessGoal,
            activityLevel,
            experienceLevel,
            targetWeight,
            unitPreference
        } = req.body;

        const updateFields = { updatedAt: new Date() };

        if (username !== undefined) updateFields.username = username;
        if (fullName !== undefined) updateFields.fullName = fullName;
        if (height !== undefined) updateFields.height = height;
        if (weight !== undefined) updateFields.weight = weight;
        if (dateOfBirth !== undefined) updateFields.dateOfBirth = new Date(dateOfBirth);
        if (gender !== undefined) updateFields.gender = gender;
        if (fitnessGoal !== undefined) updateFields.fitnessGoal = fitnessGoal;
        if (activityLevel !== undefined) updateFields.activityLevel = activityLevel;
        if (experienceLevel !== undefined) updateFields.experienceLevel = experienceLevel;
        if (targetWeight !== undefined) updateFields.targetWeight = targetWeight;
        if (unitPreference !== undefined) updateFields.unitPreference = unitPreference;

        if (username) {
            const existingUser = await db.collection('users').findOne({
                username,
                _id: { $ne: new ObjectId(userId) }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
        }

        let oldProfilePicToDelete = null;

        if (req.file) {
            updateFields.profilePicture = `/uploads/profile-pics/${req.file.filename}`;

            if (req.user.profilePicture) {
                oldProfilePicToDelete = path.join(
                    process.cwd(),
                    req.user.profilePicture.replace(/^\//, '')
                );
            }
        }

        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateFields },
            {
                returnDocument: 'after',
                projection: { password: 0, verificationToken: 0, verificationExpiry: 0 }
            }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (oldProfilePicToDelete) {
            fs.unlink(oldProfilePicToDelete, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Failed to delete old profile picture:', err);
                }
            });
        }

        return res.json({
            success: true,
            message: 'Profile updated successfully',
            user: result
        });

    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

async function createWorkout(req, res) {
    try {
        const workoutData = {
            ...req.body,
            userId: req.user._id,
            createdAt: new Date()
        };
        const result = await req.db.collection('workouts').insertOne(workoutData);
        res.json({ success: true, workout: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getWorkouts(req, res) {
    try {
        const workouts = await req.db.collection('workouts').find({ userId: req.user._id }).toArray();
        res.json({ success: true, workouts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getSingleWorkout(req, res) {
    try {
        const workout = await req.db.collection('workouts').findOne({
            _id: new ObjectId(req.params.id),
            userId: req.user._id
        });
        if (!workout) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }
        res.json({ success: true, workout });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateWorkout(req, res) {
    try {
        const result = await req.db.collection('workouts').updateOne(
            { _id: new ObjectId(req.params.id), userId: req.user._id },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }
        res.json({ success: true, message: 'Workout updated', result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function deleteWorkout(req, res) {
    try {
        const result = await req.db.collection('workouts').deleteOne({
            _id: new ObjectId(req.params.id),
            userId: req.user._id
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }
        res.json({ success: true, message: 'Workout deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function sendAdminNotification(db, userId) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Professional Workout Request',
        text: `A new professional workout request has been submitted.\n\nUser ID: ${userId}\nStatus: Pending\n\nPlease review this request in the admin panel.`
    });
}

async function getsubscriptionPlans(req, res) {
    try {
        const plans = await req.db.collection('Subscriptions').find().toArray();
        res.json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getsinglesubscriptionPlan(req, res) {
    try {
        var planId = req.params.id;
        const plan = await req.db.collection('Subscriptions').findOne({ _id: new ObjectId(planId) });
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Subscription plan not found' });
        }
        res.json({ success: true, plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function subscribe(req, res) {
    try {
        const userId = req.user._id;
        const { address, planId, cardnumber } = req.body;

        const subscription = await req.db.collection('Subscriptions').findOne({ _id: new ObjectId(planId) });

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        const subscriptionData = {
            userId: userId,
            cardnumber: cardnumber,
            planId: subscription._id,
            address: address,
            requestedAt: new Date(),
            subscriptionName: subscription.name,
            subscriptionPlan: subscription.plan,
            subscriptionPrice: subscription.price,
            subscriptionDescription: subscription.description,
            subscriptionDuration: subscription.duration,
            status: 'pending',
            workoutPlan: [],
            startDate: null,
            expiresAt: null
        };

        const result = await req.db.collection('UserSubscriptions').insertOne(subscriptionData);

        sendAdminNotification(req.db, userId).catch(err => {
            console.error('Failed to send admin notification email:', err);
        });

        return res.json({ success: true, message: 'Subscription request submitted', subscription: result });

    } catch (err) {
        console.error('Error in subscribe:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

async function getMyWorkoutPlan(req, res) {
    try {
        const sub = await req.db.collection('UserSubscriptions').findOne({
            userId: req.user._id,
            status: 'active'
        });

        if (!sub) {
            return res.status(404).json({ success: false, message: 'No active subscription found' });
        }

        const daysElapsed = Math.floor((new Date() - sub.startDate) / (1000 * 60 * 60 * 24));
        const todaysWorkout = sub.workoutPlan[daysElapsed] || null;

        res.json({ success: true, fullPlan: sub.workoutPlan, today: todaysWorkout, dayNumber: daysElapsed + 1 });
    } catch (err) {
        console.error('Error in getMyWorkoutPlan:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = {
    getUser, updateUser, upload, createWorkout, getWorkouts,
    getSingleWorkout, updateWorkout, deleteWorkout,
    getsubscriptionPlans, getsinglesubscriptionPlan, subscribe,
    getMyWorkoutPlan
};