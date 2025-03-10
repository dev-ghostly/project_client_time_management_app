const express = require('express');
const router = express.Router();
const clientTimerController = require('../controllers/client_timer.controller');
const jwtMiddleware = require('../middleware/jwtMiddleware');

// CRUD routes
router.post('/', jwtMiddleware, clientTimerController.createClientTimer);
router.get('/', jwtMiddleware, clientTimerController.getAllClientTimers);
router.get('/:id', jwtMiddleware, clientTimerController.getClientTimer);
router.put('/:id', jwtMiddleware, clientTimerController.updateClientTimer);
router.delete('/:id', jwtMiddleware, clientTimerController.deleteClientTimer);

module.exports = router;
