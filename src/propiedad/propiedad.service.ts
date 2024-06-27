import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Propiedad } from './entities/propiedad.entity';
import { CreatePropiedadDto } from './dto/create-propiedad.dto';
import { Inmueble } from 'src/inmueble/entities/inmueble.entity';
import { OpenaiService } from 'src/openai/openai.service';
import { SupabaseService } from 'src/supabase/supabase.service';


@Injectable()
export class PropiedadService {
  private readonly logger = new Logger('PropiedadService')
  constructor( 
    @InjectRepository(Propiedad, 'primary') private readonly propiedadRepository: Repository<Propiedad>,
    @InjectRepository(Inmueble, 'primary') private readonly inmuebleRepository: Repository<Inmueble>,
    private readonly openaiService: OpenaiService,
    private readonly supabaseService: SupabaseService
  ){}

  
  async create(createPropiedadDto: CreatePropiedadDto){
    const inmueble = await this.inmuebleRepository.findOneBy({ id: createPropiedadDto.inmuebleId });
    if (!inmueble) {
        throw new NotFoundException('El inmueble especificada no existe');
    }    
    const propiedad = this.propiedadRepository.create({ 
     ...createPropiedadDto,      
     inmueble
    });
    await this.propiedadRepository.save(propiedad)

    var descripcion = `En ${propiedad.tipo} ${propiedad.inmueble.nombre} ` + 
    `con superficie de ${propiedad.superficie} ` + 
    `direccion ${propiedad.direccion} ` + 
    `A ${propiedad.precio} cuenta con `;


    propiedad.descripcion = descripcion;
    await this.propiedadRepository.save(propiedad)

    return propiedad;
  }


  findAll() {
    return this.propiedadRepository.find({});
  }  

  async embedding() {
    var propiedades = await this.propiedadRepository.find({});
    for (const propiedad of propiedades) {
      const embeddings : number[] = await this.openaiService.generateEmbedding(propiedad.descripcion);
      const id_propiedades = propiedad.id;
      const body = propiedad.descripcion;
      await this.supabaseService.insertarPropiedad(embeddings, id_propiedades, body);      
    }
    return 'success'
  }


}
