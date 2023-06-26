import { Controller, Get, Inject, Query, Res, Sse } from '@nestjs/common';
import { readFileSync } from 'fs';
import { BaseCallbackHandler } from 'langchain/callbacks';
import { join } from 'path';
import { Observable } from 'rxjs';
import { LLMService } from 'src/llm/llm.service';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(@Inject(LLMService) private readonly llmService: LLMService) {}

  @Get()
  indexed(@Res() response: Response) {
    return response
      .type('text/html')
      .send(readFileSync(join(process.cwd(), '/static/index.html')).toString());
  }

  @Sse('sse')
  async sse(
    @Query('question') question: string,
    @Query('history') history: string[],
  ): Promise<Observable<string>> {
    const chain = await this.llmService.initChain('SDH');

    return new Observable<string>((subscriber) => {
      const handlers = BaseCallbackHandler.fromMethods({
        handleLLMNewToken(token) {
          subscriber.next(token);
        },
      });
      chain
        .call(
          {
            question,
            chat_history: history,
          },
          [handlers],
        )
        .catch((error) => {
          subscriber.error(error);
        })
        .finally(() => {
          subscriber.complete();
        });
    });
  }
}
