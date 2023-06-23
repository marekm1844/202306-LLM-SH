import { Body, Controller, Get, Post, Res, Sse } from '@nestjs/common';
import { readFileSync } from 'fs';
import { BaseCallbackHandler } from 'langchain/callbacks';
import { join } from 'path';
import { Observable } from 'rxjs';
import { LLMService } from 'src/llm/llm.service';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  private llmService: LLMService;
  private cities: string[] = [];
  constructor() {
    this.llmService = new LLMService();
  }

  @Get()
  indexed(@Res() response: Response) {
    return response
      .type('text/html')
      .send(readFileSync(join(process.cwd(), '/static/index.html')).toString());
  }

  @Sse('sse')
  async sse(): Promise<Observable<string>> {
    const chain = await this.llmService.initChain();

    return new Observable<string>((subscriber) => {
      const handlers = BaseCallbackHandler.fromMethods({
        handleLLMNewToken(token) {
          subscriber.next(token);
        },
      });
      chain
        .call(
          {
            city: 'London',
            month: 'January',
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

  @Post('add')
  add(@Body('citi') citi: string) {
    this.cities.push(citi);
    return citi;
  }
}
