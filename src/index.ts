import { app } from "./app";
import { config } from "./config";

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Failed to start server: ", error);
  process.exit(1);
});
