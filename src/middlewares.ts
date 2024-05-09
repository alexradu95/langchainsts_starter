import bodyParser from "body-parser";
import cors from "cors";
import { Express } from "express-serve-static-core";

export function registerMiddlewares(app: Express) {
  app.use(cors());
  app.use(bodyParser.json());
}