import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import compression from 'compression';

import { specs } from './swagger';
import { NotFoundError } from './common/errors/not-found';
import { errorHandler } from './common/middlewares/error-handler';
import { authRoutes } from './auth/auth.routes';
import { apiRateLimiter } from './common/middlewares/rate-limiter';
import { config } from './config';

const app = express();

app.use(helmet());

app.use(compression());

// Configuración segura de CORS
const allowedOrigins = config.ALLOWED_ORIGINS.split(',').map(origin =>
  origin.trim()
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (por ejemplo, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Apply general rate limiting to all routes
app.use(apiRateLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);

app.use(() => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
