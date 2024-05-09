import { Express } from "express";
import { handleMessage } from "../controllers/messageController";

export default function messageRoutes(app: Express) {
  app.post("/message", handleMessage);
}