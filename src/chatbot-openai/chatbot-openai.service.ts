import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CreateChatbotOpenaiDto } from './dto/create-chatbot-openai.dto';
import { ClientesService } from 'src/clientes/clientes.service';
import { TwilioService } from 'src/twilio/twilio.service';
import { OpenaiService } from 'src/openai/openai.service';
import { SupabaseService } from 'src/supabase/supabase.service';


@Injectable()
export class ChatbotOpenaiService {

  constructor( 
    private readonly clientesService: ClientesService,
    private readonly twilioService: TwilioService,
    private readonly openaiService: OpenaiService,
    private readonly supabaseService: SupabaseService
  ) {}

 
  async saludo({ prompt, telefono }: CreateChatbotOpenaiDto) {
    const response = await this.openaiService.generateResponse(prompt, 'Vivian');
    return {response};
  }
  
  async generateEmbedding( text: string ) {

    const response = await this.openaiService.generateEmbedding(text);

    return response;
  }

  async enviarMensajeTwilio(numeroDestino: string, msj: string, nombre: string) {
    try {
      const cliente = await this.clientesService.findByPhone(numeroDestino);
      // Verifica si existe el cliente
      if (!cliente) {
        await this.clientesService.create({ nombre, telefono: numeroDestino });
      }
      // Crea la respuesta personalizada para el usuario
      const  message  = await this.openaiService.generateResponse(msj, nombre);
      // Envia el mensaje de respuesta al cliente
      await this.twilioService.sendMessage(numeroDestino, message);

    } catch (error) {
      console.error('Ha ocurrido un error:', error);
    }
  }

  async findSimilarVectors(query: string): Promise<any> {
    const queryEmbedding = await await this.openaiService.generateEmbedding(query);
    const matches = await this.supabaseService.matchDocuments(queryEmbedding, 0.78, 10);
  
    console.log(matches);

    return matches;
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
                    const embedding: number[] = await this.openaiService.generateEmbedding(plainText);
                    console.log('Este es el embedding', embedding);
                    
                    await this.supabaseService.insertVector(embedding, file, plainText);
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
    return plainText;
  }

  segmentMarkdown(markdownContent: string): string[] {
    const segments = markdownContent.split(/\n(?=\s*(?:#|=|_|[a-z]+ ))/i);
    
    // Elimina los segmentos vacíos o que contengan solo espacios en blanco
    return segments.filter(segment => segment.trim() !== '' &&  segment.trim() !== '=========');
}


}
