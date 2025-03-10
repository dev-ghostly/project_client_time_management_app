const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/jwtMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Example of a protected route
router.get('/profile', verifyToken, userController.getProfile);

module.exports = router;
