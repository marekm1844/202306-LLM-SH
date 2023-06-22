import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient } from 'chromadb';
import { Result } from 'typescript-functional-extensions';

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
    },
  ],
  exports: ['ChromaDBVectorStore'],
})
export class VectorStoreModule {}
