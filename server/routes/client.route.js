const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.post('/',jwtMiddleware, clientController.createClient);
router.get('/',jwtMiddleware, clientController.getClients);
router.get('/:id',jwtMiddleware, clientController.getClientById);
router.put('/:id',jwtMiddleware, clientController.updateClient);
router.delete('/:id',jwtMiddleware, clientController.deleteClient);

module.exports = router;
