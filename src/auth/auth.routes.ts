import { Router } from 'express';

import { authController } from './auth.controller';
import { validate } from '../common/middlewares/request-validation';
import { loginSchema, registerSchema, refreshSchema } from './auth.schema';
import { requireAuth } from '../common/middlewares/auth';
import {
  authRateLimiter,
  refreshTokenRateLimiter,
  registrationRateLimiter,
} from '../common/middlewares/rate-limiter';

const router = Router();

// Public routes with rate limiting
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  authController.login
);
router.post(
  '/register',
  registrationRateLimiter,
  validate(registerSchema),
  authController.register
);
router.post(
  '/refresh',
  refreshTokenRateLimiter,
  validate(refreshSchema),
  authController.refresh
);

// Protected routes
router.get('/current-user', requireAuth, authController.currentUser);
router.get('/private', requireAuth, authController.privateRoute);

export { router as authRoutes };
