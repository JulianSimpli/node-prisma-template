import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";

import { NotFoundError } from "./common/errors/not-found";
import { errorHandler } from "./common/middlewares/error-handler";
import { authRoutes } from "./auth/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);

app.use(() => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
