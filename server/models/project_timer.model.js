// import mongoose schema
const mongoose = require('mongoose');
// create a schema
const projectTimerSchema = new mongoose.Schema({
    duration: Number,
    goal: String,
    userId: mongoose.Schema.Types.ObjectId,
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
});

module.exports = mongoose.model('ProjectTimer', projectTimerSchema);