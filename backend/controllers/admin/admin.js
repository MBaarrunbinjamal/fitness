// controllers/admin/admin.js
// controllers/admin/admin.js
const nodemailer = require('nodemailer');
const path = require('path');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const fs = require('fs');
var auth = require('../../middleware/auth');

async function getAllUsers(req, res) {
    try {
        var users = await req.db.collection('users').find().toArray();
        res.json({ success: true, users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

async function getworkoutRequests(req, res) {
    try {
        var requests = await req.db.collection('UserSubscriptions').aggregate([{
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        }]).toArray();
        res.json({ success: true, requests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        await req.db.collection('users').deleteOne({ _id: new ObjectId(userId) });
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

async function acceptrequest(req, res) {
    try {
        var requestId = req.params.id;
        var request = await req.db.collection('UserSubscriptions').findOne({ _id: new ObjectId(requestId) });

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (request.status === 'accepted') {
            return res.status(400).json({ success: false, message: 'Request already accepted' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Invalid request status' });
        }

        await req.db.collection('UserSubscriptions').updateOne(
            { _id: new ObjectId(requestId) },
            { $set: { status: 'accepted' } }
        );
        await req.db.collection('users').updateOne(
            { _id: request.userId },
            { $set: { subscriber: true } }
        );

        try {
            await sendacceptNotification(req.db, request.userId);
        } catch (err) {
            console.error('Failed to send accept notification email:', err);
        }

        res.json({ success: true, message: 'Request accepted successfully. Awaiting workout plan upload.' });

    } catch (err) {
        console.error('Error in acceptrequest:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

async function rejectrequest(req, res) {
    try {
        var requestId = req.params.id;
        var request = await req.db.collection('UserSubscriptions').findOne({ _id: new ObjectId(requestId) });

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        if (request.status === 'rejected') {
            return res.status(400).json({ success: false, message: 'Request already rejected' });
        }
        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Invalid request status' });
        }

        await req.db.collection('UserSubscriptions').updateOne(
            { _id: new ObjectId(requestId) },
            { $set: { status: 'rejected' } }
        );

        try {
            await sendrejectNotification(req.db, request.userId);
        } catch (err) {
            console.error('Failed to send reject notification email:', err);
        }

        res.json({ success: true, message: 'Request rejected successfully' });
    } catch (err) {
        console.error('Error in rejectrequest:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

async function addsubscriptionPlan(req, res) {
    try {
        var { name, plan, price, description, duration } = req.body;
        var subscriptionData = {
            name: name,
            plan: plan,
            price: price,
            description: description,
            duration: duration
        };
        var result = await req.db.collection('Subscriptions').insertOne(subscriptionData);
        res.json({ success: true, message: 'Subscription added successfully', subscription: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

async function sendacceptNotification(db, userIdtoSend) {
    var user = await db.collection('users').findOne({ _id: new ObjectId(userIdtoSend) });
    var useremail = user.email;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: useremail,
        subject: 'Your Professional Workout Request Has Been Approved',
        text: `Good news!\n\nYour professional workout request has been approved.\n\nUser ID: ${userIdtoSend}\nStatus: Approved\n\nYou can now access your professional workout plan in the app.`
    });
}

async function sendrejectNotification(db, userIdtoSend) {
    var user = await db.collection('users').findOne({ _id: new ObjectId(userIdtoSend) });
    var useremail = user.email;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: useremail,
        subject: 'Your Professional Workout Request Was Not Approved',
        text: `We're writing to let you know that your professional workout request was not approved at this time.\n\nUser ID: ${userIdtoSend}\nStatus: Rejected\n\nIf you have questions or would like to submit a new request, please reach out through the app and your payment would be returned effective and immediately.`
    });
}

async function uploadWorkoutPlan(req, res) {
    try {
        const subscriptionId = req.params.id;
        const { workoutPlan } = req.body;

        const subscription = await req.db.collection('UserSubscriptions').findOne({ _id: new ObjectId(subscriptionId) });

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        if (subscription.status !== 'accepted') {
            return res.status(400).json({ success: false, message: 'Subscription must be accepted before a plan can be uploaded' });
        }
        if (!Array.isArray(workoutPlan) || workoutPlan.length !== subscription.subscriptionDuration) {
            return res.status(400).json({
                success: false,
                message: `Workout plan must contain exactly ${subscription.subscriptionDuration} days`
            });
        }

        const startDate = new Date();
        const expiresAt = new Date(startDate);
        expiresAt.setDate(expiresAt.getDate() + subscription.subscriptionDuration);

        await req.db.collection('UserSubscriptions').updateOne(
            { _id: new ObjectId(subscriptionId) },
            { $set: { workoutPlan, status: 'active', startDate, expiresAt } }
        );

        res.json({ success: true, message: 'Workout plan uploaded, subscription is now active' });
    } catch (err) {
        console.error('Error in uploadWorkoutPlan:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = {
    getAllUsers, getworkoutRequests, deleteUser, acceptrequest, rejectrequest,
    addsubscriptionPlan, sendacceptNotification, sendrejectNotification,
    uploadWorkoutPlan
};