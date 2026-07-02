// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Connection
let db;
const client = new MongoClient(process.env.MONGO_URL);

async function connectDB() {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}
connectDB();

// Make db available globally
app.use((req, res, next) => {
    req.db = db;
    next();
});

// DEBUG: Log all requests
app.use((req, res, next) => {
    console.log('📢', req.method, req.url);
    next();
});

// Routes
const routes = require('./routes/routes');
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
    console.log('❌ 404 - Route not found:', req.method, req.url);
    res.status(404).json({
        success: false,
        message: 'Route not found: ' + req.url
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
});

module.exports = { app, db, client };