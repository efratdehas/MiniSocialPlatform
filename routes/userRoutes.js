import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';
import { validateRegister, validateLogin } from '../middleware/userValidation.js';

// התחברות
router.post('/login', validateLogin, userController.login);
// הרשמה
router.post('/register', validateRegister, userController.register);

export default router;