import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Imagen } from './entities/imagen.entity';

@Injectable()
export class ImagenService {

    private readonly logger = new Logger('ImagenService')
    constructor( 
        @InjectRepository(Imagen, 'primary') private readonly imagenRepository: Repository<Imagen>
      ){}
}
