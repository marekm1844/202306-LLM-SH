import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from 'typescript-functional-extensions';
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

@Injectable()
export class VectorStoreRepository {
  constructor(
    @Inject('ChromaDBVectorStore')
    private readonly chromaResult: Result<ChromaClient>,
    private readonly apiKey: string,
  ) {}

  createCollection(name: string) {
    return this.chromaResult.bind((chromaClient) =>
      Result.try(
        async () => {
          chromaClient.createCollection({
            name,
            embeddingFunction: {
              generate: (texts: string[]) => this.generateEmbedding(texts),
            },
          });
          Logger.debug(`Created collection ${name}`);
        },
        (error) => `Failed to create collection: ${error}`,
      ),
    );
  }

  getCollection(name: string) {
    return this.chromaResult.bind((chromaClient) =>
      Result.try(
        async () =>
          chromaClient.getOrCreateCollection({
            name,
            embeddingFunction: {
              generate: (texts: string[]) => this.generateEmbedding(texts),
            },
          }),
        (error) => `Failed to get collection: ${error}`,
      ),
    );
  }

  listCollections() {
    return this.chromaResult.bind((chromaClient) =>
      Result.try(
        async () => chromaClient.listCollections(),
        (error) => `Failed to list collections: ${error}`,
      ),
    );
  }

  deleteCollection(name: string) {
    return this.chromaResult.bind((chromaClient) =>
      Result.try(
        async () => {
          chromaClient.deleteCollection({ name });
          Logger.debug(`Deleted collection ${name}`);
        },
        (error) => `Failed to list collections: ${error}`,
      ),
    );
  }

  private async generateEmbedding(texts: string[]) {
    const embedder = new OpenAIEmbeddings({ openAIApiKey: this.apiKey });
    return embedder.embedDocuments(texts);
  }
}
