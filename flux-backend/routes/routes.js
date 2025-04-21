import express from 'express';
import { register, login, saveDeviceStats, getDeviceStats, getUser,addAcceleratorToDevice, getAcceleratorInfo, getPayment, webHookPayment} from '../controllers/controllers.js';
import { authenticate } from '../authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/device-stats', authenticate, getDeviceStats);
router.get('/get-user', authenticate, getUser);
router.post('/device-stats', authenticate, saveDeviceStats);
router.post('/save-accel/:uuid', authenticate, addAcceleratorToDevice);
router.get('/get-accel-info', getAcceleratorInfo);
router.post('/get-payment', authenticate, getPayment);
router.post('/webhook', webHookPayment);


export default router;