import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";


const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama3",
});

const loader = new CheerioWebBaseLoader(
  "https://js.langchain.com/docs/get_started/introduction"
);

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

    const docs = await loader.load();

    console.log(docs.length);
    console.log(docs[0].pageContent.length);

    const splitter = new RecursiveCharacterTextSplitter();

    const splitDocs = await splitter.splitDocuments(docs);

    console.log(splitDocs.length);
    console.log(splitDocs[0].pageContent.length);

    const embeddings = new OllamaEmbeddings({
      model: "nomic-embed-text",
      maxConcurrency: 5,
    });

    const vectorstore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings
    );

    const prompt =
        ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

      <context>
      {context}
      </context>

      Question: {input}`);

      const documentChain = await createStuffDocumentsChain({
        llm: chatModel,
        prompt,
      });

      
      const retriever = vectorstore.asRetriever();

      const retrievalChain = await createRetrievalChain({
        combineDocsChain: documentChain,
        retriever,
      });

      const result = await retrievalChain.invoke({
        input: "what is LangSmith?",
      });

    // Responding back with received message - or you could add custom logic here
    res.status(200).json({
      message: "Message received", 
      data: result
    });
});

// Server listening
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});