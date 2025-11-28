import { Router } from 'express';
import { saveProgress, loadProgress } from './saveController.js';
const router = Router();
router.post('/save', saveProgress);
router.get('/load', loadProgress);
export default router;
