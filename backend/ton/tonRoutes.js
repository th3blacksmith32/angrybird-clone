import { Router } from 'express';
import { balance, send } from './tonController.js';
const router = Router();
router.get('/balance', balance);
router.post('/send', send);
export default router;
