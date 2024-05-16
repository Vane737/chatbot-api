import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatbotOpenaiService } from './chatbot-openai.service';
import { CreateChatbotOpenaiDto } from './dto/create-chatbot-openai.dto';

@Controller('chatbot-openai')
export class ChatbotOpenaiController {
  constructor(private readonly chatbotOpenaiService: ChatbotOpenaiService) {}

  @Post('saludo')
  saludoCordial(@Body() createChatbotOpenaiDto: CreateChatbotOpenaiDto) {
    return this.chatbotOpenaiService.saludo(createChatbotOpenaiDto);
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
