import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [LLMService],
  exports: [LLMService],
})
export class LlmModule {}
