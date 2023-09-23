import { LLMChain, OpenAI } from 'langchain';
import { QUESTION_PROMPT, SUMMARY_PROMPT } from './prompts';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Chroma } from 'langchain/vectorstores';
import { ConversationalRetrievalQAChain, loadQAChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

@Injectable()
export class LLMService {
  private model: OpenAI;
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.model = new OpenAI({
      temperature: 0,
      streaming: true,
      modelName: 'gpt-4',
    });
  }

  private async createChain(vectorStore: Chroma) {
    const questionGenerator = new LLMChain({
      llm: this.model,
      prompt: SUMMARY_PROMPT,
    });
    const docChain = loadQAChain(this.model, {
      type: 'stuff',
      prompt: QUESTION_PROMPT,
    });

    const chain = new ConversationalRetrievalQAChain({
      retriever: vectorStore.asRetriever(),
      combineDocumentsChain: docChain,
      questionGeneratorChain: questionGenerator,
    });

    // https://github.com/hwchase17/langchainjs/issues/1327
    chain.memory = new BufferMemory({
      inputKey: 'chat_history',
    });

    return chain;
  }

  private async initChroma(collectionName: string) {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    const vectorStore = await Chroma.fromExistingCollection(embeddings, {
      collectionName,
      url: this.configService.get<string>('CHROMADB_URL'),
    });
    return vectorStore;
  }

  async initChain(collectionName: string) {
    const vectorStore = await this.initChroma(collectionName);
    const chain = await this.createChain(vectorStore);
    return chain;
  }
}
