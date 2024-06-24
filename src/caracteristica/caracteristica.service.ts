import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Propiedad } from 'src/propiedad/entities/propiedad.entity';
import { Repository } from 'typeorm';
import { CreateCaracteristicaDto } from './dto/create-caracteristica.dto';

import { Caracteristica } from './entities/caracteristica.entity';

@Injectable()
export class CaracteristicaService {

  private readonly logger = new Logger('CaracteristicaService')
  constructor( 
    @InjectRepository(Caracteristica, 'primary') private readonly caracteristicaRepository: Repository<Caracteristica>,
    @InjectRepository(Propiedad, 'primary') private readonly propiedadRepository: Repository<Propiedad>

  ){}

  async create(createCaracteristicaDto: CreateCaracteristicaDto){
    const propiedad = await this.propiedadRepository.findOneBy({ id: createCaracteristicaDto.propiedadId });
    if (!propiedad) {
        throw new NotFoundException('La propiedad especificada no existe');
    }    
    const caracteristica = this.caracteristicaRepository.create({ 
     ...createCaracteristicaDto,      
     propiedad
    });
    await this.caracteristicaRepository.save(caracteristica);
    
    var descripcion =  `${propiedad.descripcion}. Tiene ${caracteristica.descripcion}`;
    propiedad.descripcion = descripcion;
    await this.propiedadRepository.save(propiedad)

    return caracteristica;

  }  
  
  

}
