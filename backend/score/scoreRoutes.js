import { Router } from 'express';
import { submit } from './scoreController.js';
const router = Router();
router.post('/submit', submit);
export default router;
