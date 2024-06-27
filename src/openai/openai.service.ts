import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';


import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';



@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private llm: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;
  
  constructor( private readonly configService: ConfigService ) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    this.openai = new OpenAI({ apiKey });

    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.9,
    });

    // Configuración de OpenAI para embeddings
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
    });
  }
  
  async generateResponse(prompt: string, nombre: string): Promise<string> {
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente que ayuda a los usuarios respondiendo sus preguntas de manera clara y respetuosa. Puedes dirigirte al usuario por su nombre: ${nombre}.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    return response.choices[0].message.content;
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
  
  

  // Métodos alternativos utilizando ChatOpenAI y OpenAIEmbeddings

  // async generateChatResponse(prompt: string, nombre: string): Promise<string> {
  //   const response = await this.llm.generateResponse(prompt, nombre);
  //   return response;
  // }

  // async generateTextEmbedding(text: string): Promise<any> {
  //   const embedding = await this.embeddings.vectorize(text);
  //   return embedding;
  // }
  // From ChatbotopenAiService
  // async genResponse({ prompt, nombre }: Options ) {
    
  //   const response = await this.openaiService.generateResponse(prompt, nombre);
  
  //   return { message: response };
  // }
  
  
}
