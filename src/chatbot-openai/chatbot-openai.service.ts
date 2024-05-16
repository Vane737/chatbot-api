import { Injectable } from '@nestjs/common';
import { CreateChatbotOpenaiDto } from './dto/create-chatbot-openai.dto';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientesService } from 'src/clientes/clientes.service';
import OpenAI from 'openai';

interface Options {
  prompt: string;
  nombre: string;
}


@Injectable()
export class ChatbotOpenaiService {

  private openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY

})
  constructor( 

    @InjectRepository(Cliente) 
    private readonly clienteRepository: Repository<Cliente>,
    private readonly clientesService: ClientesService
  ) { }

  async saludo({ prompt , telefono }: CreateChatbotOpenaiDto ) {
    const { nombre }: Cliente = await this.clientesService.findByPhone(telefono);
    return await this.requestSaludo(this.openai, { prompt, nombre });
  }

  create(createChatbotOpenaiDto: CreateChatbotOpenaiDto) {
    return 'This action adds a new chatbotOpenai';
  }

  findAll() {
    return `This action returns all chatbotOpenai`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatbotOpenai`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatbotOpenai`;
  }


  requestSaludo = async( openai: OpenAI, { prompt, nombre }: Options ) => {

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ 
            role: "system", 
            content: `Eres un asistente que ayuda a los usuarios respondiendo sus preguntas de manera clara y respetuosa. Puedes dirigirte al usuario por su nombre: ${nombre}.` 
            },
            {
              role: "user", 
              content: `${prompt}` 
            }
        ],
        temperature: 0.2,
      });


    return { message: response.choices[0].message.content };
}
}
