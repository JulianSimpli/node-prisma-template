import { CustomError } from "./custom";

export class UnauthorizedError extends CustomError {
  statusCode = 401;
  private customMessage?: string;

  constructor(message?: string) {
    super(message || "Unauthorized");
    this.customMessage = message;
    // only because we are extending a built in class
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: this.customMessage || "Unauthorized" }];
  }
} 