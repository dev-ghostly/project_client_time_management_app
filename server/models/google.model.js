const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    accessToken: String,
    refreshToken: String,
    tokenExpiry: Date
});

module.exports = mongoose.model('Google', googleSchema);
