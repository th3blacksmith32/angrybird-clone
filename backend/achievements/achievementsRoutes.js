import { Router } from 'express';
import { list, unlock } from './achievementsController.js';
const router = Router();
router.get('/list', list);
router.post('/unlock', unlock);
export default router;
