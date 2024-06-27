import { Module } from '@nestjs/common';
import { ConversacionService } from './conversacion.service';
import { ConversacionController } from './conversacion.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Conversacion } from './entities/conversacion.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { ConsultaModule } from 'src/consulta/consulta.module';


@Module({
  providers: [ConversacionService],
  controllers: [ConversacionController],
  imports: [
    TypeOrmModule.forFeature([Conversacion,Cliente,Consulta], 'primary'),
    ConsultaModule
  ],
  exports: [ConversacionService],
})
export class ConversacionModule {}
