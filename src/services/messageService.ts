import { chatModel, loader, createRetrievalProcess } from '../utils/langchainSetup';

export async function processMessage(inputMessage: string) {
  // This function now wraps the extracted functionality or can directly call specific utilities.
  const docs = await loader.load();
  // The process for splitting documents, creating embeddings, and retrieval would be in `langchainSetup` or similar utility modules.
  
  const result = await createRetrievalProcess(docs, inputMessage);
  
  return result;
}