import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatbotOpenaiService } from './chatbot-openai.service';
import { CreateChatbotOpenaiDto } from './dto/create-chatbot-openai.dto';
import { VectorEntity } from './entities/vector.entity';
import * as path from 'path';


@Controller('chatbot-openai')
export class ChatbotOpenaiController {
  constructor(private readonly chatbotOpenaiService: ChatbotOpenaiService) {}

  @Post('saludo')
  saludoCordial(@Body() createChatbotOpenaiDto: CreateChatbotOpenaiDto) {
    return this.chatbotOpenaiService.saludo(createChatbotOpenaiDto);
  }

  @Post('twilio')
  async handleWebhook(@Body() body: any) {
    try {
      console.log("req ->", body);
      

      
      const message = body.Body;

      await this.chatbotOpenaiService.enviarMensajeTwilio(body.WaId, message, body.ProfileName);
      return { ok: true, msg: "Mensaje enviado con éxito" };
    } catch (error) {
      console.error("Error:", error);
      return { ok: false, msg: "Error al procesar la solicitud" };
    }
  }


  @Post('embedding')
  async createEmbedding(@Body('text') text: string): Promise<any> {
    return this.chatbotOpenaiService.generateEmbedding(text);
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


  
  @Post('vector')
  async createVector(
    @Body('embedding') embedding: number[],
    @Body('title') title: string,
    @Body('body') body: string,
  ): Promise<VectorEntity> {
    return this.chatbotOpenaiService.createVector(embedding, title, body);
  }

  @Post('find-similar')
  async findSimilar(@Body('query') query: string) {
    const results = await this.chatbotOpenaiService.findSimilarVectors(query);
    return results;
  }

  @Get()
  findAll() {
    return this.chatbotOpenaiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatbotOpenaiService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatbotOpenaiService.remove(+id);
  }
}
