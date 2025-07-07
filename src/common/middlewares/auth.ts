// src/common/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";

import { UnauthorizedError } from "../errors/unauthorized";
import { verifyToken } from "../../auth/auth.utils";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    req.currentUser = { id: payload.id };
    next();
  } catch (error) {
    throw new UnauthorizedError();
  }
}