import { Module } from '@nestjs/common';
import { ChatbotOpenaiService } from './chatbot-openai.service';
import { ChatbotOpenaiController } from './chatbot-openai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientesService } from 'src/clientes/clientes.service';
import { ClientesModule } from 'src/clientes/clientes.module';
import { Cliente } from 'src/clientes/entities/cliente.entity';

import { TwilioService } from 'src/twilio/twilio.service';
import { OpenaiService } from 'src/openai/openai.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ConversacionService } from 'src/conversacion/conversacion.service';
import { ConversacionModule } from 'src/conversacion/conversacion.module';
import { ConsultaModule } from 'src/consulta/consulta.module';

@Module({
  controllers: [ChatbotOpenaiController],
  providers: [ChatbotOpenaiService, ClientesService, TwilioService, OpenaiService, SupabaseService],
  imports: [
    TypeOrmModule.forFeature([Cliente], 'primary'), // Repositorio para la conexión primaria
    // TypeOrmModule.forFeature([VectorEntity], 'supabase'), // Repositorio para la conexión de Supabase
    ClientesModule,
    ConversacionModule,
    ConsultaModule
  ]
})
export class ChatbotOpenaiModule {}
