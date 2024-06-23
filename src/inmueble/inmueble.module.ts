import { Module } from '@nestjs/common';
import { InmuebleService } from './inmueble.service';
import { InmuebleController } from './inmueble.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Propiedad } from 'src/propiedad/entities/propiedad.entity';
import { Inmueble } from './entities/inmueble.entity';

@Module({
  providers: [InmuebleService],
  controllers: [InmuebleController],
  imports: [
    TypeOrmModule.forFeature([Inmueble,Propiedad], 'primary'),
  ],
})
export class InmuebleModule {}
