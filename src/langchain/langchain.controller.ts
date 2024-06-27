import { Body, Controller, Get, Post } from '@nestjs/common';
import { LangchainService } from './langchain.service';

@Controller('langchain')
export class LangchainController {


  constructor(private readonly langchainService: LangchainService) {}

  @Get('initialize')
  async initializeData() {
    await this.langchainService.initializeData();
    return { message: 'Data Initialized Successfully!' };
  }

  @Get('loadingdata')
  async loadInmueblesData() {
    await this.langchainService.loadInmueblesData();
    return { message: 'Data Loaded and Vectorized Successfully!' };
  }

  @Post('querydata')
  async queryData(@Body('query') query: string, @Body('topK') topK: number) {
    const results = await this.langchainService.searchAndAnswer(query, topK);
    return { results };
  }
}
