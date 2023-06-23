import { LLMChain, OpenAI } from 'langchain';
import { AVG_TEMP_PROMPT } from './prompts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LLMService {
  private model: OpenAI;
  constructor() {
    this.model = new OpenAI({
      temperature: 0,
      streaming: true,
      modelName: 'gpt-3.5-turbo',
    });
  }

  private async createChain() {
    const chain = new LLMChain({
      llm: this.model,
      prompt: AVG_TEMP_PROMPT,
    });

    return chain;
  }

  async initChain() {
    const chain = await this.createChain();
    return chain;
  }
}
