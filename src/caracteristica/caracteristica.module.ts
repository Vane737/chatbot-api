import { Module } from '@nestjs/common';
import { CaracteristicaService } from './caracteristica.service';
import { CaracteristicaController } from './caracteristica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Caracteristica } from './entities/caracteristica.entity';
import { Propiedad } from 'src/propiedad/entities/propiedad.entity';

@Module({
  providers: [CaracteristicaService],
  controllers: [CaracteristicaController],
  imports: [
    TypeOrmModule.forFeature([Caracteristica,Propiedad], 'primary'),
  ],
})
export class CaracteristicaModule {}
