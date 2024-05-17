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
