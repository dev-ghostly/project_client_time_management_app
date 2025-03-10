const clientTimerModel = require('../models/client_timer.model');

// CRUD operations
exports.createClientTimer = async (req, res) => {
    const { duration, goal, client } = req.body;
    const userId = req.user.userId;
    const timer = new clientTimerModel({ duration, goal, userId, client });
    await timer.save();
    res.status(201).json({ message: 'Client timer created', timer });
};

exports.getAllClientTimers = async (req, res) => {
    const userId = req.user.userId;
    try {
        const timers = await clientTimerModel.find({ userId }).populate('client');
        res.status(200).json(timers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch client timers' });
    }
};

exports.getClientTimer = async (req, res) => {
    const { id } = req.params;
    const timer = await clientTimerModel.findById(id);
    if (timer) {
        res.status(200).json(timer);
    } else {
        res.status(404).json({ message: 'Client timer not found' });
    }
};

exports.updateClientTimer = async (req, res) => {
    const { id } = req.params;
    const { duration, goal, client } = req.body;
    const userId = req.user.userId;
    const timer = await clientTimerModel.findByIdAndUpdate(id, { duration, goal, userId, client }, { new: true });
    if (timer) {
        res.status(200).json({ message: 'Client timer updated', timer });
    } else {
        res.status(404).json({ message: 'Client timer not found' });
    }
};

exports.deleteClientTimer = async (req, res) => {
    const { id } = req.params;
    const timer = await clientTimerModel.findByIdAndDelete(id);
    if (timer) {
        res.status(200).json({ message: 'Client timer deleted' });
    } else {
        res.status(404).json({ message: 'Client timer not found' });
    }
};
