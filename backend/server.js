const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const { expireOldSubscriptions } = require('./utils/subscriptions'); // adjust path to wherever you put it

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

        // set up cron only after db is ready
        cron.schedule('0 0 * * *', async () => {
            console.log('Running subscription expiry check...');
            try {
                await expireOldSubscriptions(db);
            } catch (err) {
                console.error('Error running subscription expiry check:', err);
            }
        });

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