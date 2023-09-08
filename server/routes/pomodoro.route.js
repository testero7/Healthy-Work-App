import express from 'express';
import { addPomodoro, deletePomodoro, getPomodorosForUser, testPomodoro, updatePomodoro } from '../controllers/pomodoro.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/testPomodoro', testPomodoro);
router.get('/getPomodoro/:id',verifyToken, getPomodorosForUser);
router.post('/addPomodoro/:id',verifyToken, addPomodoro);
router.delete('/deletePomodoro/:id/:pomodoroId',verifyToken, deletePomodoro);
router.post('/updatePomodoro/:id/:pomodoroId',verifyToken, updatePomodoro);
export default router;