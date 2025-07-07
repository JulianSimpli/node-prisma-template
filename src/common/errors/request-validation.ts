import { ZodIssue } from "zod";
import { CustomError } from "./custom";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(private errors: ZodIssue[]) {
    super("Invalid request parameters");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return this.errors.map((err) => {
      return { message: err.message, field: err.path.join(".") };
    });
  }
}
