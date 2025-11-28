import { Router } from 'express';
import { signup, login, telegramLogin, refresh } from './authController.js';
const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/telegramLogin', telegramLogin);
router.post('/refresh', refresh);
export default router;
