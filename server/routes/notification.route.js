import express from 'express';
import { addNotification, deleteNotification, getNotification, testNotification, updateNotification } from '../controllers/notification.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/testNotification', testNotification);
router.get('/getNotification/:id',verifyToken, getNotification);
router.post('/addNotification/:id',verifyToken, addNotification);
router.delete('/deleteNotification/:id/:notificationId',verifyToken, deleteNotification);
router.post('/updateNotification/:id/:notificationId',verifyToken, updateNotification);

export default router;