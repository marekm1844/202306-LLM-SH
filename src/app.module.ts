import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { LlmModule } from './llm/llm.module';
import { ChatModule } from './chat/chat.module';
import { DocumentLoaderModule } from './document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    VectorStoreModule,
    LlmModule,
    ChatModule,
    DocumentLoaderModule,
  ],
})
export class AppModule {}
