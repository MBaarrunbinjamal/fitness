const { ObjectId } = require('mongodb');

// Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const db = req.db;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }

        const user = await db.collection('users').findOne({
            verificationToken: token,
            verificationExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        await db.collection('users').updateOne(
            { _id: new ObjectId(user._id) },
            { 
                $set: { 
                    isVerified: true, 
                    status: 'active',
                    verificationToken: null,
                    verificationExpiry: null,
                    updatedAt: new Date()
                } 
            }
        );

        res.json({
            success: true,
            message: 'Email verified successfully. You can now login.'
        });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// API: Resend Verification Email
exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const db = req.db;
        const crypto = require('crypto');
        const { sendVerificationEmail } = require('../../utils/email');

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
        }

        const newToken = crypto.randomBytes(32).toString('hex');
        const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.collection('users').updateOne(
            { _id: new ObjectId(user._id) },
            { 
                $set: { 
                    verificationToken: newToken,
                    verificationExpiry: newExpiry,
                    updatedAt: new Date()
                } 
            }
        );

        await sendVerificationEmail(email, newToken);

        res.json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};