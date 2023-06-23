import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    VectorStoreModule,
    LlmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
