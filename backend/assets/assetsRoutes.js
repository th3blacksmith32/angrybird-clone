import { Router } from 'express';
import { uploadLevel, listLevels, getLevel } from './assetsController.js';
const router = Router();
router.post('/levels/upload', uploadLevel);
router.get('/levels/list', listLevels);
router.get('/levels/:levelName', getLevel);
export default router;
