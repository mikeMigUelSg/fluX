import express from 'express';
import { register, login, saveDeviceStats, getDeviceStats, getUser} from '../controllers/authController.js';
import { authenticate } from '../authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/device-stats', authenticate, getDeviceStats);
router.get('/get-user', authenticate, getUser);
router.post('/device-stats', authenticate, saveDeviceStats);

export default router;