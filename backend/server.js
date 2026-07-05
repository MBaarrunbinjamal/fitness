const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

let db;
const client = new MongoClient(process.env.MONGO_URL);

async function connectDB() {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
connectDB();

app.use((req, res, next) => {
    req.db = db;
    next();
});

const routes = require('./routes/routes');
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});