import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";


const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama3",
});

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Hello World Route
app.get("/", (_, response) => {
    response.send("Hello world!");
});

// POST route to receive a message
app.post("/message", async (req, res) => {
    const { message } = req.body; // Extracting message from request body

    if (!message) {
        return res.status(400).send("Message is required");
    }

    // Here you could potentially process the message or send it to your chat model
    console.log("Received message:", message);

    var response = await chatModel.invoke(message);

    // Responding back with received message - or you could add custom logic here
    res.status(200).json({
      message: "Message received", 
      data: response
    });
});

// Server listening
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});