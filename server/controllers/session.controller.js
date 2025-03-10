const Session = require('../models/session.model');
const ClientTimer = require('../models/client_timer.model');
const ProjectTimer = require('../models/project_timer.model');

const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.userId });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
};

const createSession = async (req, res) => {
    try {
        // if there is a client, create a client timer
        if (req.body.client) {
            const clientTimer = new ClientTimer({
                duration: 0,
                goal : req.body.goal,
                client: req.body.client,
                userId: req.user.userId,
                startTime: req.body.startTime,
                endTime: req.body.endTime
            });
            await clientTimer.save();
            req.body.client_timer = clientTimer._id;
        }
        // same for project
        if (req.body.project) {
            const projectTimer = new ProjectTimer({
                duration: 0,
                goal: req.body.goal,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                project: req.body.project,
                userId: req.user.userId
            });
            await projectTimer.save();
            req.body.project_timer = projectTimer._id;
        }
        const session = new Session({ ...req.body, userId: req.user.userId });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create session' });
    }
};

const updateSession = async (req, res) => {
    console.log(req.body);
    try {
        const { startTime, endTime } = req.body;
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            { startTime, endTime },
            { new: true }
        );
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.project_timer) {
            await ProjectTimer.findByIdAndUpdate(
                session.project_timer,
                { startTime, endTime },
                { new: true }
            );
        }

        if (session.client_timer) {
            await ClientTimer.findByIdAndUpdate(
                session.client_timer,
                { startTime, endTime },
                { new: true }
            );
        }

        console.log(session);
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update session' });
    }
};

module.exports = {
    getSessions,
    createSession,
    updateSession
};
