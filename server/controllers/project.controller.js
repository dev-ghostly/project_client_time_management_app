const Project = require('../models/project.model');
const ProjectTimer = require('../models/project_timer.model');

exports.createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).send(project);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('client');
        const projectsWithTimers = await Promise.all(projects.map(async (project) => {
            const timers = await ProjectTimer.find({ project: project._id });
            const lastActivity = timers.length > 0 ? timers[timers.length - 1].endTime : null;
            const totalTime = timers.reduce((acc, timer) => {
                const startTime = new Date(timer.startTime).getTime(); // Corrected property name
                const endTime = new Date(timer.endTime).getTime(); // Corrected property name
                return acc + (endTime - startTime);
            }, 0) / (1000 * 60); // Convert milliseconds to minutes
            console.log(totalTime);
            return {
                ...project.toObject(),
                lastActivity,
                totalTime
            };
        }));
        res.status(200).send(projectsWithTimers);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('client');
        if (!project) {
            return res.status(404).send();
        }
        res.status(200).send(project);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).send();
        }
        res.status(200).send(project);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).send();
        }
        res.status(200).send(project);
    } catch (error) {
        res.status(500).send(error);
    }
};
