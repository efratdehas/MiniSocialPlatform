import { Router } from 'express';

import userController from '../controllers/userController.js';
import { validateRegister, validateLogin } from '../middleware/userValidation.js';

const router = Router();

// התחברות
router.post('/login', validateLogin, userController.login);
// הרשמה
router.post('/register', validateRegister, userController.register);

export default router;