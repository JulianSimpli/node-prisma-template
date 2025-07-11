import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom';
import { logger } from '../../common/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  logger.error(err);

  res.status(500).send({
    errors: [{ message: 'Something went wrong' }],
  });
  return;
};
