import express from "express";
import { registerMiddlewares } from "./middlewares";
import { registerRoutes } from "./routes";

const app = express();
const port = 3000;

registerMiddlewares(app);
registerRoutes(app);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});