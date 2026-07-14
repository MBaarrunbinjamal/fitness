const path = require('path');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const fs = require('fs');

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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
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

        // Check if username already exists
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

        // Delete old profile picture if exists
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

module.exports = { getUser, updateUser, upload };