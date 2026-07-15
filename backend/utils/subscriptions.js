async function expireOldSubscriptions(db) {
    const now = new Date();
    const expired = await db.collection('UserSubscriptions').find({
        status: 'active',
        expiresAt: { $lt: now }
    }).toArray();

    for (const sub of expired) {
        await db.collection('UserSubscriptions').updateOne(
            { _id: sub._id },
            { $set: { status: 'inactive' } }
        );
        await db.collection('users').updateOne(
            { _id: sub.userId },
            { $set: { subscriber: false } }
        );
    }
}

module.exports = { expireOldSubscriptions };