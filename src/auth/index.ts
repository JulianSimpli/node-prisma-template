// Types
export * from './auth.types';

// Utilities
export * from './auth.utils';

// Service - explicit exports to avoid conflicts
export { register, login, refresh } from './auth.service';

// Controller - explicit exports to avoid conflicts
export {
  register as registerController,
  login as loginController,
  refresh as refreshController,
  currentUser,
  privateRoute,
} from './auth.controller';

// Routes
export * from './auth.routes';

// Schemas
export * from './auth.schema';
