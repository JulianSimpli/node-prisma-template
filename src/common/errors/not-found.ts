import { CustomError } from "./custom";

export class NotFoundError extends CustomError {
  statusCode = 404;
  private customMessage?: string;

  constructor(message?: string) {
    super(message || "Resource not found");
    this.customMessage = message;
    // only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: this.customMessage || "Resource not found" }];
  }
}
