const express = require('express');
const { getSessions, createSession, updateSession } = require('../controllers/session.controller');
const verifyToken = require('../middleware/jwtMiddleware');

const router = express.Router();

router.get('/', verifyToken, getSessions);
router.post('/', verifyToken, createSession);
router.put('/:id', verifyToken, updateSession);

module.exports = router;
