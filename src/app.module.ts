import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ChatbotOpenaiModule } from './chatbot-openai/chatbot-openai.module';
// import { VectorEntity } from './chatbot-openai/entities/vector.entity';

import { Cliente } from './clientes/entities/cliente.entity';
import { ConsultaModule } from './consulta/consulta.module';
import { ConversacionModule } from './conversacion/conversacion.module';
import { CitaModule } from './cita/cita.module';
import { PropiedadModule } from './propiedad/propiedad.module';
import { CaracteristicaModule } from './caracteristica/caracteristica.module';
import { ImagenModule } from './imagen/imagen.module';
import { InmuebleModule } from './inmueble/inmueble.module';


import { TwilioModule } from './twilio/twilio.module';
import { OpenaiModule } from './openai/openai.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PdfModule } from './pdf/pdf.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Hace que el ConfigModule esté disponible globalmente
    }),
    TypeOrmModule.forRootAsync({
      name: 'primary',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        // url: configService.get('DATABASE_URL'),
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DATABASE,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        entities: ['dist/src/**/*.entity{.ts,.js}'],
        autoLoadEntities: true, // Carga automaticamente las entidades
        synchronize: true,  // Realiza las migraciones automaticamente
        //ssl: false,         
         ssl: true,
         extra: {
           ssl: {
             rejectUnauthorized: false,
           },
         }         
      }),
     }),
     // Conexión a la base de datos de Supabase
    
    TypeOrmModule.forRootAsync({
      name: 'supabase',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('SUPABASE_HOST'),
        // host: process.env.SUPABASE_HOST,
        // port: +process.env.SUPABASE_PORT,
        // database: process.env.SUPABASE_DATABASE,
        // username: process.env.SUPABASE_USERNAME,
        // password: process.env.SUPABASE_PASSWORD,
        // entities: [VectorEntity],
        autoLoadEntities: true, // Carga automaticamente las entidades
        synchronize: true,  // Realiza las migraciones automaticamente
      }),
     }),
    ClientesModule,
    ChatbotOpenaiModule,
    ConsultaModule,
    ConversacionModule,
    CitaModule,
    PropiedadModule,
    CaracteristicaModule,
    ImagenModule,
    InmuebleModule,
    TwilioModule,
    OpenaiModule,
    SupabaseModule,
    PdfModule,
    
  ],
  providers: [TypeOrmModule],

})
export class AppModule {
}
