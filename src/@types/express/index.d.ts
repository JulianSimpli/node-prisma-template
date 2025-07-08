import { UserPayload } from "../../auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null;
    }
  }
}