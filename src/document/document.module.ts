import { Module } from '@nestjs/common';
import { ConfluenceLoaderService } from './confluance-loader.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentController } from './document.controller';
import { DocumentLoaderService } from './document-loader.service';
import { VectorStoreModule } from 'src/vector-store/vector-store.module';

@Module({
  imports: [ConfigModule, VectorStoreModule],
  providers: [DocumentLoaderService, ConfluenceLoaderService, ConfigService],
  controllers: [DocumentController],
  exports: [],
})
export class DocumentLoaderModule {}
