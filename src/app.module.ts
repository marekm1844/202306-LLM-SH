import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { LlmModule } from './llm/llm.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    VectorStoreModule,
    LlmModule,
    ChatModule,
  ],
})
export class AppModule {}
