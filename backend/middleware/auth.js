// middleware/auth.js
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        console.log('🔑 Auth Middleware - Token:', token ? 'Present' : 'Missing');
        
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('✅ Token decoded:', decoded.id);
        
        const db = req.db;
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(decoded.id) },
            { projection: { password: 0 } }
        );

        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.status === 'inactive') {
            console.log('❌ User inactive');
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        req.user = user;
        req.userId = user._id;
        console.log('✅ Auth successful for user:', user.username);
        next();
    } catch (error) {
        console.log('❌ Auth Error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};