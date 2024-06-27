import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CreateChatCompletionRequestMessage } from 'openai/resources';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  
  constructor( private readonly configService: ConfigService ) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    this.openai = new OpenAI({ apiKey });
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

  async determinarPaso(prompt: string){
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente virtual que se centra en la venta de casas dependiendo de la consulta
          necesito que evalues y devuelvas solo una palabra de estas palabras
          casa: si el usuario te da una descripcion de la casa o departamento que quiere, generalmente 
          empieza con busco o quiero una casa o departamento en venta/alquiler seguido de caracteristicas de la casa
          caracteristica: si te dice que quiere agregar algo a la casa que ya descrita, como quiero jardin,quiero 5 habitaciones,etc
          cita: si quiere agendar una cita, va decir que quiere o preguntar como agenda una cita, tambien si te dice una hora fecha y numero de propiedad esta hablando de cita.
          historial: si se refiere a un mensaje pasado siempre sera una pregunta o peticion en pasado como, cual 
          es la direccion,cuanto es el precio,cuantos baños tiene la opcion o propiedad 2, hablame de la opcion 2 o la tercera casa
          contexto: si te dice algo que no tiene que ver con casas o venta de casas ni las otras opciones.`,
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

  async generarRespuesta(prompt: string){
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente virtual para ayudar a comprar o alquilar viviendas 
          como departamentos y casas,eres un buen vender,si te doy varias opciones de 
          propiedades utiliza las primeras 2 y detalla la mitad de sus caracteristicas`,
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

  async numero(prompt: string){
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `De la informacion que te estoy pasando necesito que me devuelvas en formato json
          la hora, la fecha y el numero de la propiedad, solo esass 3 cosas, ninguna palabra de mas de esta forma la fecha y hora tendran el siguiente formato como ejemplo para la fecha 30 de junio de 2024
          y para la hora 10:00 AM
          {
            "Hora": "",
            "Fecha": "",
            "id_propiedad": 
          }`,
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

  async customJson(prompt: string){
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `De la informacion que te estoy pasando necesito que me devuelvas un json con un resumen de la descripcion de la propiedad y el lugar en donde se encuentra  
          {
            "descripcion": "",
            "lugar": "",
          }`,
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

  // From ChatbotopenAiService
  // async genResponse({ prompt, nombre }: Options ) {

  //   const response = await this.openaiService.generateResponse(prompt, nombre);

  //   return { message: response };
  // }

  
}
