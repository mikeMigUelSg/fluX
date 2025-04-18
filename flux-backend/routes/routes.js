import express from 'express';
import { register, login, saveDeviceStats} from '../controllers/authController.js';
import { authenticate } from '../authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/device-stats', authenticate, saveDeviceStats);

export default router;