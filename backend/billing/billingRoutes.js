import { Router } from 'express';
import { subscribe, cancel, status } from './billingController.js';
import fraudMiddleware from './fraudMiddleware.js';
const router = Router();
router.post('/subscribe', fraudMiddleware, subscribe);
router.post('/cancel', fraudMiddleware, cancel);
router.get('/status', status);
export default router;
