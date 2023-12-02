import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import pomodoroRoutes from './routes/pomodoro.route.js';
import notificationRoutes from './routes/notification.route.js';
import cookieParser from 'cookie-parser';
import configurationRoutes from './routes/configuration.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to database!");
}).catch((err) => {
    console.log(err);
});


const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server on port 3000!");
});



app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/pomodoro", pomodoroRoutes);

app.use("/api/notification", notificationRoutes);

app.use("/api/configuration", configurationRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
});