const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.route');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const timerModel = require('./models/timer.model');
const sessionModel = require('./models/session.model');
const sessionRoutes = require('./routes/session.route');
const googleRoutes = require('./routes/google.route');
const clientRoutes = require('./routes/client.route');
const projectRoutes = require('./routes/project.route');
const projectTimerModel = require('./models/project_timer.model');
const clientTimerModel = require('./models/client_timer.model');
const clientTimerRoutes = require('./routes/client_timer.route');
const projectTimerRoutes = require('./routes/project_timer.route');
const taskRoutes = require('./routes/task.route');

const app = express();
const port = process.env.PORT || 3210;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/client_time_management').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/client-timers', clientTimerRoutes);
app.use('/api/project-timers', projectTimerRoutes);
app.use('/api/tasks', taskRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});


io.on('connection', (socket) => {
    console.log('a user connected');
    let interval;
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('start_timer', async (duration, goal, userId, type, client, project) => {
        console.log('timer started for', duration, 'minutes');
        console.log('client ', client);
        console.log('project ', project);
        const timer = new timerModel({ duration, goal, userId, type, client: client ? new mongoose.Types.ObjectId(client) : undefined, project: project ? new mongoose.Types.ObjectId(project) : undefined  });
        await timer.save();
        io.emit('timer_started', { duration });
        let remainingTime = duration * 60; // convert minutes to seconds
        interval = setInterval(async () => {
            remainingTime -= 1;
            io.emit('timer_update', { remainingTime });
            if (remainingTime <= 0) {
                clearInterval(interval);
                io.emit('timer_ended');
                const projectTimer = new projectTimerModel({
                    duration: timer.duration,
                    goal: timer.goal,
                    userId: timer.userId,
                    startTime: timer.startTime,
                    project: timer.project
                })
                await projectTimer.save();
                const clientTimer = new clientTimerModel({
                    duration: timer.duration,
                    goal: timer.goal,
                    userId: timer.userId,
                    startTime: timer.startTime,
                    client: timer.client
                })
                await clientTimer.save();
                const session = new sessionModel({
                    startTime: timer.startTime,
                    endTime: new Date(),
                    goal: timer.goal,
                    userId: timer.userId,
                    type: timer.type,
                    project_timer: projectTimer._id,
                    client_timer: clientTimer._id
                });
                await session.save();
            }
        }, 1000);
    });
    socket.on('stop_timer', async () => {
        console.log('timer stopped');
        clearInterval(interval);
        io.emit('timer_stopped');
        const timer = await timerModel.findOne().sort({ startTime: -1 });
        var projectTimer = null;
        var clientTimer = null;
        if (timer) {
            if (timer.project) {
                projectTimer = new projectTimerModel({
                    duration: timer.duration,
                    goal: timer.goal,
                    userId: timer.userId,
                    startTime: timer.startTime,
                    project: timer.project
                })
                await projectTimer.save();
            }
            if (timer.client) {
                clientTimer = new clientTimerModel({
                    duration: timer.duration,
                    goal: timer.goal,
                    userId: timer.userId,
                    startTime: timer.startTime,
                    client: timer.client
                })
                await clientTimer.save();
            }
            const session = new sessionModel({
                startTime: timer.startTime,
                endTime: new Date(),
                goal: timer.goal,
                userId: timer.userId,
                type: timer.type,
                project_timer: projectTimer ? projectTimer._id : undefined,
                client_timer: clientTimer ? clientTimer._id : undefined
            });
            await session.save();
        }
    });
    socket.on('get_timer_status', () => {
        console.log('timer status requested');
        io.emit('timer_status', { status: 'stopped' });
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
