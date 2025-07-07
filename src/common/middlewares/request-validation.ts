import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation";

type SchemaMap = {
  body?: ZodSchema<unknown>;
  query?: ZodSchema<unknown>;
  params?: ZodSchema<unknown>;
};

export function validate(
  schemas: ZodSchema<unknown> | SchemaMap,
  property: "body" | "query" | "params" = "body",
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (
      typeof schemas === "object" &&
      ("body" in schemas || "query" in schemas || "params" in schemas)
    ) {
      const map = schemas as SchemaMap;
      if (map.body) {
        const result = map.body.safeParse(req.body);
        if (!result.success)
          throw new RequestValidationError(result.error.issues);
      }
      if (map.query) {
        const result = map.query.safeParse(req.query);
        if (!result.success)
          throw new RequestValidationError(result.error.issues);
      }
      if (map.params) {
        const result = map.params.safeParse(req.params);
        if (!result.success)
          throw new RequestValidationError(result.error.issues);
      }
      next();
    } else {
      const schema = schemas as ZodSchema<unknown>;
      const result = schema.safeParse(req[property]);
      if (!result.success)
        throw new RequestValidationError(result.error.issues);
      next();
    }
  };
}
