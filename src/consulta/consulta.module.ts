import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Consulta } from './entities/consulta.entity';
import { Conversacion } from 'src/conversacion/entities/conversacion.entity';

@Module({
  providers: [ConsultaService],
  controllers: [ConsultaController],
  imports: [
    TypeOrmModule.forFeature([Consulta,Conversacion], 'primary'),
  ],
 
})
export class ConsultaModule {}
