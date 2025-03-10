const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    color: { type: String, required: true },
});

module.exports = mongoose.model('Project', projectSchema);
