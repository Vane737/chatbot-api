import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateInmubleDto } from './dto/create-inmuble.dto';
import { Inmueble } from './entities/inmueble.entity';

@Injectable()
export class InmuebleService {  
  private readonly logger = new Logger('InmuebleService')
  constructor( 
    @InjectRepository(Inmueble, 'primary') private readonly inmuebleRepository: Repository<Inmueble>
  ){}


  async create(createInmubleDto: CreateInmubleDto) {    
    const inmuble = this.inmuebleRepository.create(createInmubleDto);
    await this.inmuebleRepository.save(inmuble);
    return inmuble;    
  }      

  async findOne(id: number) {
      const inmueble = await this.inmuebleRepository.findOneBy({ id });
      if ( !inmueble ) {
        throw new NotFoundException(`El inmueble con el id ${ id } no fue encontrado.`)
      }
      return inmueble;
    }

}
