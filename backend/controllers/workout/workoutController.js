const { ObjectId } = require('mongodb');


exports.createWorkout = async function (req, res) {
    try {
        const result = await req.db.collection('workouts').insertOne(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getWorkouts = async function (req, res) {
    try {
        const workouts = await req.db.collection('workouts').find().toArray();
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getSingleWorkout = async function (req, res) {
    try {
        const workout = await req.db.collection('workouts').findOne({ _id: new ObjectId(req.params.id) });
        res.json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateWorkout = async function (req, res) {
    try {
        const result = await req.db.collection('workouts').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteWorkout = async function (req, res) {
    try {
        const result = await req.db.collection('workouts').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: 'Workout deleted', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};