import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Consulta } from './entities/consulta.entity';


@Injectable()
export class ConsultaService {
  
  private readonly logger = new Logger('ConsultaService')
  constructor( 
    @InjectRepository(Consulta, 'primary') private readonly consulaRepository: Repository<Consulta>
  ){}

}
