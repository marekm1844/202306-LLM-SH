import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';

@Module({
  providers: [LLMService],
})
export class LlmModule {}
