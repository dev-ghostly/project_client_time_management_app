const ProjectTimer = require('../models/project_timer.model');

// Create a new project timer
exports.createProjectTimer = async (req, res) => {
    req.body.userId = req.user.userId;
    try {
        const projectTimer = new ProjectTimer(req.body);
        await projectTimer.save();
        res.status(201).send(projectTimer);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all project timers
exports.getAllProjectTimers = async (req, res) => {
    try {
        // get all the project timers with the project inside
        const projectTimers = await ProjectTimer.find({ userId: req.user.userId }).populate('project');
        res.status(200).send(projectTimers);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a single project timer by ID
exports.getProjectTimerById = async (req, res) => {
    try {
        const projectTimer = await ProjectTimer.findById(req.params.id).populate('project');
        if (!projectTimer) {
            return res.status(404).send({ error: 'Project timer not found' });
        }
        res.status(200).send(projectTimer);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a project timer by ID
exports.updateProjectTimerById = async (req, res) => {
    try {
        const projectTimer = await ProjectTimer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!projectTimer) {
            return res.status(404).send({ error: 'Project timer not found' });
        }
        res.status(200).send(projectTimer);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a project timer by ID
exports.deleteProjectTimerById = async (req, res) => {
    try {
        const projectTimer = await ProjectTimer.findByIdAndDelete(req.params.id);
        if (!projectTimer) {
            return res.status(404).send({ error: 'Project timer not found' });
        }
        res.status(200).send({ message: 'Project timer deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
};
