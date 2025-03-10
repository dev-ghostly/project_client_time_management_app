// import mongoose schema
const mongoose = require('mongoose');
// create a schema
const timerSchema = new mongoose.Schema({
    duration: Number,
    goal: String,
    userId: mongoose.Schema.Types.ObjectId,
    startTime: { type: Date, default: Date.now },
    type: String,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }
});

module.exports = mongoose.model('Timer', timerSchema);