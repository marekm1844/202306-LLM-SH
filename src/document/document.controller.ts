import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ConfluenceLoaderService } from './confluance-loader.service';
import { DocumentLoaderService } from './document-loader.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';
import { VectorStoreRepository } from 'src/vector-store/vector-store.repository';
import { Result } from 'typescript-functional-extensions';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly loadService: DocumentLoaderService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject('VectorStoreRepository')
    private readonly vectorStore: VectorStoreRepository,
  ) {
    this.loadService.setDocumentLoader(
      new ConfluenceLoaderService(configService),
    );
  }

  @Post('load')
  async loadDocuments(@Body() params: { baseUrl: string; spaceKey: string }) {
    const result = await this.loadService.load(params);

    const splitDocs = await this.loadService.splitDocuments(result);

    const documents: string[] = [];
    const ids: string[] = [];
    const metadata: Record<string, any>[] = [];
    for (const doc of splitDocs) {
      const id = uuidV4();
      ids.push(id);
      documents.push(doc.pageContent);
      metadata.push(doc.metadata);
    }

    const collectionResult = await this.vectorStore.getCollection(
      params.spaceKey,
    );

    return collectionResult.match({
      success: async (collectionPromise) => {
        const collection = await collectionPromise;
        Logger.debug(await collection.count());
        const ok = await collection.add({
          ids: ids,
          documents: documents,
          metadatas: metadata,
        });
        Logger.debug(ok);
        const count = await collection.count();
        console.log(
          `added to collection ${params.spaceKey}, now contains ${count} documents`,
        );
        return Result.success<Document[], string>(result);
      },
      failure: (error) => Result.failure<Document[], string>(error),
    });

    return result;
  }
}
