const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const verifyToken = require('../middleware/jwtMiddleware');

router.post('/', verifyToken, taskController.createTask);
router.get('/project/:projectId', verifyToken, taskController.getTasks);
router.get('/:id', verifyToken, taskController.getTask);
router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);

module.exports = router;
