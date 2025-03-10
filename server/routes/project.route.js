const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const jwtMiddleware = require('../middleware/jwtMiddleware');

// Create a new project
router.post('/', jwtMiddleware, projectController.createProject);

// Get all projects
router.get('/', jwtMiddleware, projectController.getAllProjects);

// Get a single project by ID
router.get('/:id', jwtMiddleware, projectController.getProjectById);

// Update a project by ID
router.put('/:id', jwtMiddleware, projectController.updateProject);

// Delete a project by ID
router.delete('/:id', jwtMiddleware, projectController.deleteProject);

module.exports = router;