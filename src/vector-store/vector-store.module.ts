import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient } from 'chromadb';
import { Result } from 'typescript-functional-extensions';
import { VectorStoreRepository } from './vector-store.repository';

@Module({
  providers: [
    {
      provide: 'ChromaDBVectorStore',
      useFactory: async (
        configService: ConfigService,
      ): Promise<Result<ChromaClient>> => {
        const chromaURL = configService.get<string>('CHROMADB_URL');
        if (!chromaURL) {
          return Result.failure(
            'ChromaDB URL is not provided in the environment variables',
          );
        }

        return Result.try(
          () => new ChromaClient({ path: chromaURL }),
          (error) => `Failed to initialize ChromaClient: ${error}`,
        );
      },
      inject: [ConfigService],
    },
    {
      provide: 'VectorStoreRepository',
      useFactory: async (
        chromaResult: Result<ChromaClient>,
        configService: ConfigService,
      ) => {
        const apiKey = configService.get<string>('OPENAI_API_KEY');

        return new VectorStoreRepository(chromaResult, apiKey);
      },
      inject: ['ChromaDBVectorStore', ConfigService],
    },
  ],
  exports: ['VectorStoreRepository'],
})
export class VectorStoreModule {}
