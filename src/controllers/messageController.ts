import { Request, Response } from "express";
import { processMessage } from "../services/messageService";

export async function handleMessage(req: Request, res: Response) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send("Message is required");
  }

  try {
    const result = await processMessage(message);
    res.status(200).json({ message: "Message received", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
}