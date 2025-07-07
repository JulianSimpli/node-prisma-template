import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  console.error(err);

  res.status(500).send({
    errors: [{ message: "Something went wrong" }],
  });
  return;
};
