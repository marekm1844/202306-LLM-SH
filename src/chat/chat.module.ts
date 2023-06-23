import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LlmModule } from 'src/llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [ChatController],
})
export class ChatModule {}
