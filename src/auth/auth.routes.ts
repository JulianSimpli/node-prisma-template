import { Router } from 'express';

import { authController } from './auth.controller';
import { validate } from '../common/middlewares/request-validation';
import { loginSchema, registerSchema, refreshSchema } from './auth.schema';
import { requireAuth } from '../common/middlewares/auth';

const router = Router();

// Public routes
router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.post('/refresh', validate(refreshSchema), authController.refresh);

// Protected routes
router.get('/current-user', requireAuth, authController.currentUser);
router.get('/private', requireAuth, authController.privateRoute);

export { router as authRoutes };
