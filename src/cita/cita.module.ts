import { Module } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cita } from './entities/cita.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Propiedad } from 'src/propiedad/entities/propiedad.entity';

@Module({
  providers: [CitaService],
  controllers: [CitaController],
  imports: [
    TypeOrmModule.forFeature([Cita,Cliente,Propiedad], 'primary'),
  ],
})
export class CitaModule {}
