const { google } = require('googleapis');
const GoogleModel = require('../models/google.model');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    "69499148378-79e5ldbhohvjs83jdah1v52cgls64r2m.apps.googleusercontent.com",
    "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",
    `http://localhost:3210/api/google/oauth2callback`
);

exports.getAuthUrl = (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.readonly'],
        state: req.user.userId.toString() // Pass user ID as state parameter
    });
    res.send({ url: authUrl });
};

exports.oauthCallback = async (req, res) => {
    const { code, state } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const googleData = new GoogleModel({
        userId: state, // Use state parameter to get user ID
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date
    });

    await googleData.save();
    // go to http://localhost:5173/
    res.redirect('http://localhost:5173/');
};

exports.getCalendarEvents = async (req, res) => {
    const googleData = await GoogleModel.findOne({ userId: req.user.userId });
    if (!googleData) {
        return res.status(404).send({ error: 'Google account not connected' });
    }

    oauth2Client.setCredentials({
        access_token: googleData.accessToken,
        refresh_token: googleData.refreshToken,
        expiry_date: googleData.tokenExpiry
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
    });

    res.send(events.data.items);
};
