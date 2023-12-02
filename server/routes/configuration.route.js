import express from 'express';
import { testConfiguration, getConfigurationsForUser, addConfiguration, deleteConfiguration, updateConfiguration, getConfigurationById } from '../controllers/configuration.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/testConfiguration', testConfiguration);
router.get('/getConfiguration/:id',verifyToken, getConfigurationsForUser);
router.post('/addConfiguration/:id',verifyToken, addConfiguration);
router.delete('/deleteConfiguration/:id/:configurationId',verifyToken, deleteConfiguration);
router.post('/updateConfiguration/:id/:configurationId',verifyToken, updateConfiguration);
router.get('/getConfiguration/:id/:configurationId', verifyToken, getConfigurationById);
export default router;