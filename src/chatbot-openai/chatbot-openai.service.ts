import { Injectable } from '@nestjs/common';
import { CreateChatbotOpenaiDto } from './dto/create-chatbot-openai.dto';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Repository } from 'typeorm';
import { Twilio } from 'twilio';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientesService } from 'src/clientes/clientes.service';
import {OpenAI} from 'openai';
import { VectorEntity } from './entities/vector.entity';
import { OpenAIResponse } from './interfaces/embedding.interface';
import { promises as fs } from 'fs';
import * as path from 'path';

import { marked } from 'marked'; // Para convertir Markdown a texto plano
import { RealtimeClient } from '@supabase/realtime-js';
// import { createClient } from '@supabase/supabase-js';
// import TurndownService from 'turndown';
const TurndownService = require('turndown');
interface Options {
  prompt: string;
  nombre: string;
}


@Injectable()
export class ChatbotOpenaiService {

  private openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY
  })
  private twilioClient: Twilio;
  private supabaseRealmtime;
  constructor( 

    @InjectRepository(Cliente, 'primary') 
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(VectorEntity, 'supabase') 
    private readonly vectorRepository: Repository<VectorEntity>,
    private readonly clientesService: ClientesService
    
  ) { 
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.supabaseRealmtime = new RealtimeClient(process.env.SUPABASE_URL);
  }

  async saludo({ prompt , telefono }: CreateChatbotOpenaiDto ) {
    const { nombre }: Cliente = await this.clientesService.findByPhone(telefono);
    return await this.requestSaludo(this.openai, { prompt, nombre });
  }

  async enviarMensajeTwilio(numeroDestino: string, msj: string, nombre: string) {
    try {
      const cliente = await this.clientesService.findByPhone(numeroDestino);
      if (cliente === null ) {
        this.clientesService.create({nombre, telefono: numeroDestino})
      }
      const {message} =  await this.requestSaludo(this.openai, {prompt:msj, nombre})

      console.log(numeroDestino);
      await this.twilioClient.messages.create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+${numeroDestino}`
      });
      console.log('Mensaje enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
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

  async createVector(embedding: number[], title: string, body: string): Promise<VectorEntity> {
    const entity = this.vectorRepository.create({ embedding,  title, body });
    return this.vectorRepository.save(entity);
  }

  async generateEmbedding(text: string): Promise<any> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
      encoding_format: "float",
    });
    console.log('ESTA ES LA RESPUESTA DE EMBEDDING', response.data[0].embedding);
    
    return response.data[0].embedding;
  }
  async createVectorMd(embedding: any, fileName: string, plainText: string): Promise<void> {
    const entity = this.vectorRepository.create({
      embedding,
      title: fileName,
      body: plainText
    });
    await this.vectorRepository.save(entity);
  }


  async processMarkdownFilesInDirectory(directoryPath: string): Promise<void> {
    console.log('ESTE ES EL PATH DEL MD', directoryPath);

    try {
      
      const files = await fs.readdir(directoryPath);
      for (const file of files) {
        console.log('Este es el nombre del archivo:', file);
        
        if (path.extname(file).toLowerCase() === '.md') {
          const filePath = path.join(directoryPath, file);
          const markdownContent = await fs.readFile(filePath, 'utf-8');
          let c = 0;
          const markdownSegments = this.segmentMarkdown(markdownContent);
          // console.log('estos son los segmentos', markdownSegments);
          
                for (const segment of markdownSegments) {
                    const plainText = this.convertMarkdownToPlainText(segment);
                    console.log(plainText);
                    const embedding = await this.generateEmbedding(plainText);
                    console.log('Este es el embedding', embedding.data[0].embedding);
                    
                    await this.createVectorMd(embedding.data[0].embedding, file, plainText);
                }
        }
      }
    } catch (error) {
      console.error('Error al procesar los archivos Markdown:', error);
    }
  }

  convertMarkdownToPlainText(markdownText: string): string {

    const plainText = markdownText.replace(/\[|\]|-/g, '')
                              .replace(/(?<=\s|^)_|_(?=\s|$)/g, '')
                              .replace(/#/g, '')       // Elimina los símbolos de numeral
                              .replace(/=/g, '')       // Elimina los símbolos de numeral
                              .replace(/\*/g, '')      // Elimina los asteriscos
                              .replace(/\n+/g, ' ')    // Reemplaza las nuevas líneas por espacios
                              .trim();   
    // const plainText = turndownService.turndown(htmlContent);
    return plainText;
  }

  segmentMarkdown(markdownContent: string): string[] {
    const segments = markdownContent.split(/\n(?=\s*(?:#|=|_|[a-z]+ ))/i);
    
    // Elimina los segmentos vacíos o que contengan solo espacios en blanco
    return segments.filter(segment => segment.trim() !== '' &&  segment.trim() !== '=========');
}

async findSimilarVectors(query: string): Promise<VectorEntity[]> {
  const queryEmbedding = await this.generateEmbedding(query);

  const { data, error } = await this.supabaseRealmtime.rpc('match_script_rows', {
    query_embedding: queryEmbedding,
    similarity_threshold: 0.7,
    match_count: 5,
  });

  if (error) {
    throw new Error('Error searching for matches');
  }
  console.log(data);
  
  return data;
}

}
