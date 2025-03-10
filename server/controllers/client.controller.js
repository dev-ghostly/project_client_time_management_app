const Client = require('../models/client.model');
const ClientTimer = require('../models/client_timer.model');

exports.createClient = async (req, res) => {
    try {
        const { color, name } = req.body;
        const userId = req.user.userId;
        const client = new Client({ userId, color, name });
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find({ userId: req.user.userId });
        const clientsWithActivity = await Promise.all(clients.map(async client => {
            const timers = await ClientTimer.find({ client: client._id });
            const totalTimeSpent = timers.reduce((total, timer) => {
                const startTime = new Date(timer.startTime).getTime();
                const endTime = new Date(timer.endTime).getTime();
                return total + (endTime - startTime);
            }, 0) / (1000 * 60);
            const lastActivityDate = timers.length ? timers[timers.length - 1].endTime : null;
            return {
                ...client.toObject(),
                totalTimeSpent,
                lastActivityDate
            };
        }));
        res.status(200).json(clientsWithActivity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const { color, name } = req.body;
        const userId = req.user.userId;
        const client = await Client.findByIdAndUpdate(req.params.id, { userId, color, name }, { new: true });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
