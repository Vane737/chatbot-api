import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conversacion } from './entities/conversacion.entity';

@Injectable()
export class ConversacionService {

    private readonly logger = new Logger('ConversacionService')
    constructor( 
        @InjectRepository(Conversacion, 'primary') private readonly conversacionRepository: Repository<Conversacion>
      ){}

}
