const express = require('express');
const { getAuthUrl, oauthCallback, getCalendarEvents } = require('../controllers/google.controller');
const verifyToken = require('../middleware/jwtMiddleware');

const router = express.Router();

router.get('/auth-url', verifyToken, getAuthUrl);
router.get('/oauth2callback', oauthCallback);
router.get('/events', verifyToken, getCalendarEvents);

module.exports = router;
