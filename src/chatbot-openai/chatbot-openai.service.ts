import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CreateChatbotOpenaiDto } from './dto/create-chatbot-openai.dto';
import { ClientesService } from 'src/clientes/clientes.service';
import { TwilioService } from 'src/twilio/twilio.service';
import { OpenaiService } from 'src/openai/openai.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ConversacionService } from 'src/conversacion/conversacion.service';
import { Conversacion } from 'src/conversacion/entities/conversacion.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { ConsultaService } from 'src/consulta/consulta.service';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class ChatbotOpenaiService {

  constructor( 
    private readonly clientesService: ClientesService,
    private readonly twilioService: TwilioService,
    private readonly openaiService: OpenaiService,
    private readonly supabaseService: SupabaseService,
    private readonly conversacionService: ConversacionService,
    private readonly consultaService: ConsultaService,
    private readonly pdfService: PdfService
  ) {}

 
  async saludo({ prompt, telefono }: CreateChatbotOpenaiDto) {
    const response = await this.openaiService.generateResponse(prompt, 'Vivian');
    return {response};
  }
  
  async generateEmbedding( text: string ) {
    const response = await this.openaiService.generateEmbedding(text);
    return response;
  }

  
  async generarCamino(text: string,id: number){
    const cliente = await this.clientesService.findOne(id);
    var conversacion = await this.conversacionService.comparar(cliente);
    var response;
    var clave = 'hola';
    if(!conversacion){
      conversacion = await this.conversacionService.create(cliente);
      clave = 'hola';
    }else{
      clave = await this.determinarPaso(text);
    }
    response = await this.generarRespuesta(text,clave,conversacion,cliente);    
    return response;
  }


  async determinarPaso(text: string){
    const response = await this.openaiService.determinarPaso(text);
    return response;
  }

  async generarRespuesta(text: string,clave: string,conversacion: Conversacion,cliente: Cliente){
    let response: string;
    let jsonResponse: any;
    let prompt: string;
    let bandera: boolean = true;

    console.log(clave);
    if (clave == 'hola') {prompt = 'Saluda al usuario y preguntale que tipo de vivienda esta buscando';}
    else if (clave == 'casa') {
      prompt = await this.esCasa(text,conversacion);        
    } 
    else if (clave == 'caracteristica') {
      prompt = await this.esCaracteristica(text,conversacion); 
    } 
    else if (clave == 'cita') {
      prompt = await this.esCita(text,conversacion); 

    } 
    else if (clave == 'historial') {
      prompt = await this.esHistorial(text,conversacion); 
    } 
    else if (clave == 'contexto') {
      prompt = `Mensaje fuera de contexto sobre ventas de casas: ${text}`;
      bandera = false;
    } else {
      prompt = "No se reconoció la clave proporcionada.";
    }

    response = await this.openaiService.generarRespuesta(prompt);

    if (bandera === true) {
      await this.consultaService.create('assistant', response, false, conversacion);
    }

    if (clave === 'cita' && response.includes('Cita Agendada')) {

      jsonResponse = await this.openaiService.numero(response);

      console.log("Esto me devuelve la funcion numero", jsonResponse);
      return jsonResponse;
    } else {
      console.log(response);
      return response;
    }
    
  }


  

  async esCasa(text: string,conversacion: Conversacion){
    await this.conversacionService.eliminarConsultas(conversacion);   
    return await this.respuesta(text,conversacion);
  }

  async esCaracteristica(text: string,conversacion: Conversacion){
    var casa = await this.consultaService.buscarCasa(conversacion);
    if(!casa){
      return 'Tienes que dar primero la descripción de una casa.';
    }
    text = ` ${casa} ${text}`;
    await this.conversacionService.eliminarConsultas(conversacion);  
    return await this.respuesta(text,conversacion);
  }


  async esHistorial(text: string,conversacion: Conversacion){     
    var consultas =  await this.consultaService.getConsultas(conversacion); 
    var prompt = '';
    if(!consultas){
      return 'Tienes que dar primero la descripción de una casa.';
    }
    for (const consulta of consultas) {
      prompt += `
        { role: ${consulta.rol}, content: ${consulta.body}'}
      `;
    }
    prompt += `
        { role: 'system', content: responde a la pregunta del usuario siguiente pregunta del usuario
        en base a la informacion y contexto de la conversacion, recuerda eres un vendedor asi que si te pregunta datos de la casa/departemento
        endulzalos para que este predipuesto a agendar una cita'}
      `;
    prompt += `
        { role: 'user', content: ${text}'}
      `;
    await this.consultaService.create('user', text, false, conversacion);
    return prompt;

  }




  async esCita(text: string,conversacion: Conversacion){     
    var consultas =  await this.consultaService.getConsultas(conversacion); 
    var prompt = '';
    if(!consultas){
      return 'Tienes que dar primero la descripción de una casa.';
    }
    for (const consulta of consultas) {
      prompt += `
        { role: ${consulta.rol}, content: ${consulta.body}'}
      `;
    }
    prompt += `
        { role: 'system', content: esta pidiendo agendar una cita, si el usuario esta diciedo la hora fecha y numero de propiedad,
        responde con esa hora fecha y la informacion de la propiedad si es que existe en el registro que tienes,el usuario no necesariamente
        pondra los 3 en el mismo mensaje usa el contexto de la informacion guardada hasta que el usuario te pase los 3 datos, 
        si falta algun dato en la pregunta y en la memoria respondele que te pase el que falte,
        cuando tengas los 3 hora fecha y propiedad, pon al inicio Cita Agendada, siempre luego devuelve la hora en formato 00:00 AM o PM, la fecha en formato dd/mm/aa, estamos en el año 2024
        la direccion la direccion de la propiedad y luego la propiedad con su descipcion'}
      `;
    prompt += `
        { role: 'user', content: ${text}'}
      `;
    await this.consultaService.create('user', text, false, conversacion);
    return prompt;
  }

  async respuesta(text: string,conversacion: Conversacion){
    let prompt = '';
    
    const queryEmbedding = await this.openaiService.generateEmbedding(text);
    const matches = await this.supabaseService.matchDocuments(queryEmbedding, 0.78, 3);
    //const embeddings = await this.supabaseService.compareEmbeddings(queryEmbedding);
    //const embeddings = await this.supabaseService.getAllEmbeddings();

    for (const match of matches) {
      prompt += `
        { role: 'assistant', content: '[Propiedad ${match.id_propiedades}] ${match.body}' }
      `;
      await this.consultaService.create('assistant', `[Propiedad ${match.id_propiedades}] ${match.body}`, false, conversacion);
    }

    prompt += `
    { role: 'user', content: '${text}' }
    `;
    await this.consultaService.create('user', text, true, conversacion);
    return prompt;

  }

  async compararEmbedding(query: string): Promise<any> {
    const queryEmbedding = await this.openaiService.generateEmbedding(query);
    const matches = await this.supabaseService.matchDocuments(queryEmbedding, 0.78, 5);
    //const embeddings = await this.supabaseService.compareEmbeddings(queryEmbedding);
    //const embeddings = await this.supabaseService.getAllEmbeddings();

    return matches;
  }































  async enviarMensajeTwilio(numeroDestino: string, msj: string, nombre: string) {
    try {
      const mediaUrl = "https://edwardsib.org/ourpages/auto/2015/9/28/51403017/Cuentos%20Infantiles.pdf"
      let cliente = await this.clientesService.findByPhone(numeroDestino);
      if (!cliente) {
        cliente = await this.clientesService.create({ nombre, telefono: numeroDestino });        
      }
      
      console.log(cliente);
      console.log(msj);
      const  message  = await this.generarCamino(msj, cliente.id);
      
      //const  message  = await this.openaiService.generateResponse(msj, nombre);
      await this.twilioService.sendMessage(numeroDestino, message, mediaUrl);

    } catch (error) {
      console.error('Ha ocurrido un error:', error);
    }
  }


  async findSimilarVectors(query: string): Promise<any> {
    const queryEmbedding = await await this.openaiService.generateEmbedding(query);
    const matches = await this.supabaseService.matchDocuments(queryEmbedding, 0.78, 10);
  
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
