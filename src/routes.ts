import { Express } from "express";
import messageRoutes from "./routes/messageRoutes";

export function registerRoutes(app: Express) {
  app.get("/", (_, res) => res.send("Hello world!"));
  messageRoutes(app);
}