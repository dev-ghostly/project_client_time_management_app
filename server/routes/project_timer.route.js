const express = require('express');
const router = express.Router();
const projectTimerController = require('../controllers/project_timer.controller');
const verifyToken = require('../middleware/jwtMiddleware');

// Create a new project timer
router.post('/', verifyToken, projectTimerController.createProjectTimer);

// Get all project timers
router.get('/', verifyToken, projectTimerController.getAllProjectTimers);

// Get a single project timer by ID
router.get('/:id', verifyToken, projectTimerController.getProjectTimerById);

// Update a project timer by ID
router.put('/:id', verifyToken, projectTimerController.updateProjectTimerById);

// Delete a project timer by ID
router.delete('/:id', verifyToken, projectTimerController.deleteProjectTimerById);

module.exports = router;
