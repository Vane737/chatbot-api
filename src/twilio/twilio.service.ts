import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { ClientesService } from 'src/clientes/clientes.service';
import { OpenAI } from 'openai';

interface Options {
  prompt: string;
  nombre: string;
}


@Injectable()
export class TwilioService {
  private twilioClient: Twilio;


  constructor( private readonly configService: ConfigService ) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendMessage(numeroDestino: string, message: string) {
    try {

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


}
