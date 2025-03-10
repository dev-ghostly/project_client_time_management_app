const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    startTime: Date,
    endTime: Date,
    goal: String,
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    client_timer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientTimer',
        required: false
    },
    project_timer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectTimer',
        required: false
    }
});

module.exports = mongoose.model('Session', sessionSchema);
