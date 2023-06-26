import { Injectable, Logger } from '@nestjs/common';
import { IDocumentLoader } from './document-loader.interface';
import { ConfluencePagesLoader } from 'langchain/document_loaders/web/confluence';
import { Maybe, Result, ResultAsync } from 'typescript-functional-extensions';
import { Document } from 'langchain/document';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfluenceLoaderService implements IDocumentLoader {
  private loader: ConfluencePagesLoader | null = null;

  constructor(private readonly configService: ConfigService) {}

  async load(params: Record<string, string>) {
    const username = this.configService.get<string>('CONFLUENCE_USERNAME');
    const accessToken = this.configService.get<string>('CONFLUENCE_API_KEY');

    this.loader = new ConfluencePagesLoader({
      baseUrl: params.baseUrl,
      spaceKey: params.spaceKey,
      username: username,
      accessToken: accessToken,
    });

    return await this.loader.load();
  }
}
