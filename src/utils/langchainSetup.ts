import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";

// Preconfigured chat model instance
export const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "llama3",
});

// Loader configuration
export const loader = new CheerioWebBaseLoader("https://docs.swan.io/");

// Function to handle the document retrieval process
export async function createRetrievalProcess(docs: any[], inputMessage: string) {
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    maxConcurrency: 5,
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

  const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

  <context>
  {context}
  </context>

  Question: {input}`);

  const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt,
  });

  const retriever = vectorStore.asRetriever();

  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });

  const result = await retrievalChain.invoke({
    input: inputMessage,
  });

  return result;
}
