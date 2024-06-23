import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Propiedad } from './entities/propiedad.entity';
import { CreatePropiedadDto } from './dto/create-propiedad.dto';
import { Inmueble } from 'src/inmueble/entities/inmueble.entity';


@Injectable()
export class PropiedadService {
  private readonly logger = new Logger('PropiedadService')
  constructor( 
    @InjectRepository(Propiedad, 'primary') private readonly propiedadRepository: Repository<Propiedad>,
    @InjectRepository(Inmueble, 'primary') private readonly inmuebleRepository: Repository<Inmueble>

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
    `con superficie de ${propiedad.superficie},ccuenta con ${propiedad.pisos} pisos ` + 
    `en la direccion ${propiedad.direccion} ` + 
    `A ${propiedad.precio} `;

    propiedad.descripcion = descripcion;
    await this.propiedadRepository.save(propiedad)

    return propiedad;
  }


}
