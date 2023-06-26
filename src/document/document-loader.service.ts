import { Inject, Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { ConfluenceLoaderService } from './confluance-loader.service';
import { IDocumentLoader } from './document-loader.interface';

@Injectable()
export class DocumentLoaderService {
  private documentLoader: IDocumentLoader;

  constructor(
    @Inject(ConfluenceLoaderService)
    private readonly confluanceLoaderService: ConfluenceLoaderService,
  ) {}

  setDocumentLoader(loader: IDocumentLoader): void {
    this.documentLoader = loader;
  }

  async splitDocuments(docs: Document<Record<string, any>>[]) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docOutput = await splitter.splitDocuments(docs);
    return docOutput;
  }

  async load(params: Record<string, string>): Promise<any> {
    return this.documentLoader.load(params);
  }
}
