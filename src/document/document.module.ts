import { Module } from '@nestjs/common';
import { ConfluenceLoaderService } from './confluance-loader.service';
import { DocumentController } from './document.controller';
import { DocumentLoaderService } from './document-loader.service';
import { VectorStoreModule } from 'src/vector-store/vector-store.module';

@Module({
  imports: [VectorStoreModule],
  providers: [DocumentLoaderService, ConfluenceLoaderService],
  controllers: [DocumentController],
  exports: [],
})
export class DocumentLoaderModule {}
