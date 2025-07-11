import { app } from './app';
import { config } from './config';
import { logger } from './common/logger';

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

server.on('error', error => {
  logger.error('Failed to start server: ', error);
  process.exit(1);
});
