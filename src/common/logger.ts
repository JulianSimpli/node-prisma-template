import { createLogger, format, transports } from 'winston';
import { config } from '../config';
import { NodeEnv } from '../common/enums/node-env';

const isDev = config.NODE_ENV === NodeEnv.Development;

export const logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: isDev
    ? format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      )
    : format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});
