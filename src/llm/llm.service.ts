import { LLMChain, OpenAI } from 'langchain';
import { AVG_TEMP_PROMPT } from './prompts';

export class LLMService {
  private async createChain() {
    const model = new OpenAI({
      temperature: 0,
      streaming: true,
      modelName: 'gpt-3.5-turbo',
    });

    const chain = new LLMChain({
      llm: model,
      prompt: AVG_TEMP_PROMPT,
    });

    return chain;
  }

  async initChain() {
    const chain = await this.createChain();
    return chain;
  }
}
