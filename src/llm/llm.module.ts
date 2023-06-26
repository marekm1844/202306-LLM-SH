import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';

@Module({
  imports: [],
  providers: [LLMService],
  exports: [LLMService],
})
export class LlmModule {}
