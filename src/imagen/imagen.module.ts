import { Module } from '@nestjs/common';
import { ImagenService } from './imagen.service';
import { ImagenController } from './imagen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Imagen } from './entities/imagen.entity';
import { Propiedad } from 'src/propiedad/entities/propiedad.entity';

@Module({
  providers: [ImagenService],
  controllers: [ImagenController],
  imports: [
    TypeOrmModule.forFeature([Imagen,Propiedad], 'primary'),
  ],
})
export class ImagenModule {}
