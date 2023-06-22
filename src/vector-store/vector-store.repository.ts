import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'typescript-functional-extensions';
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { getProxyParams } from 'src/utils';

@Injectable()
export class VectorStoreRepository {
  constructor(
    @Inject('ChromaDBVectorStore')
    private readonly chromaResult: Result<ChromaClient>,
    private readonly url: string,
    private readonly apiKey: string,
    private readonly proxyPath: string,
    private readonly enableProxy: boolean,
  ) {}

  createCollection(name: string) {
    return this.chromaResult.bind((chromaClient) =>
      Result.try(
        async () =>
          chromaClient.createCollection({
            name,
            embeddingFunction: {
              generate: (texts: string[]) => this.generateEmbedding(texts),
            },
          }),
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

  private async generateEmbedding(texts: string[]) {
    const params = getProxyParams(
      this.enableProxy,
      this.proxyPath,
      this.apiKey,
    );
    const embedder = new OpenAIEmbeddings({}, params);
    return embedder.embedDocuments(texts);
  }
}
