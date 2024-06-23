import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cita } from './entities/cita.entity';

@Injectable()
export class CitaService {
    private readonly logger = new Logger('CitaService')
    constructor( 
        @InjectRepository(Cita, 'primary') private readonly citaRepository: Repository<Cita>
      ){}
    
}
