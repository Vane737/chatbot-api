import { Module } from '@nestjs/common';
import { PropiedadService } from './propiedad.service';
import { PropiedadController } from './propiedad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Propiedad } from './entities/propiedad.entity';
import { Caracteristica } from 'src/caracteristica/entities/caracteristica.entity';
import { Cita } from 'src/cita/entities/cita.entity';
import { Imagen } from 'src/imagen/entities/imagen.entity';
import { Inmueble } from 'src/inmueble/entities/inmueble.entity';
import { SupabaseService } from 'src/supabase/supabase.service';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  providers: [PropiedadService, OpenaiService, SupabaseService],
  controllers: [PropiedadController],
  imports: [
    TypeOrmModule.forFeature([Propiedad,Cita,Caracteristica,Inmueble,Imagen], 'primary'),
  ],
})
export class PropiedadModule {}
