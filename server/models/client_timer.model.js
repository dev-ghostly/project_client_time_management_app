const mongoose = require('mongoose');

const clientTimerSchema = new mongoose.Schema({
    duration: Number,
    goal: String,
    userId: mongoose.Schema.Types.ObjectId,
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
});

module.exports = mongoose.model('ClientTimer', clientTimerSchema);