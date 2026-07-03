// controllers/authentication/register.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        const db = req.db;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email and password are required'
            });
        }

        // Check existing user
        const existingUser = await db.collection('users').findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = {
            username,
            email,
            password: hashedPassword,
            fullName: fullName || username,
            role: 'user',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);

        // Generate JWT
        const token = jwt.sign(
            { id: result.insertedId, username },
            process.env.SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertedId,
                username,
                email,
                fullName: newUser.fullName
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};