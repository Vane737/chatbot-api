import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatbotOpenaiService } from './chatbot-openai.service';
import { CreateChatbotOpenaiDto } from './dto/create-chatbot-openai.dto';
import * as path from 'path';


@Controller('chatbot-openai')
export class ChatbotOpenaiController {
  constructor(private readonly chatbotOpenaiService: ChatbotOpenaiService) {}

  @Post('saludo')
  async saludoCordial(@Body() createChatbotOpenaiDto: CreateChatbotOpenaiDto) {
    return await this.chatbotOpenaiService.saludo(createChatbotOpenaiDto);
  }
  
  @Post('embedding')
  async createEmbedding(@Body('text') text: string): Promise<any> {
    return this.chatbotOpenaiService.generateEmbedding(text);
  }
  
  @Post('find-similar')
  async findSimilar(@Body('query') query: string) {
    const results = await this.chatbotOpenaiService.findSimilarVectors(query);
    return results;
  }
  
  @Post('twilio')
  async handleWebhook(@Body() body: any) {
      
    console.log("req ->", body);
      const message = body.Body;
      await this.chatbotOpenaiService.enviarMensajeTwilio(body.WaId, message, body.ProfileName);

  }
  


  @Get('process-markdown')
  async processMarkdown() {
    try {
      await this.chatbotOpenaiService.processMarkdownFilesInDirectory(path.join(__dirname, '..', '..', 'assets'));
      return 'Archivos procesados y vectorizados con éxito.';
      
    } catch (error) {
      return 'no se pudieron almacenar los archivos'
    }
  }


}
