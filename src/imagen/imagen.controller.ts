import { Controller } from '@nestjs/common';
import { ImagenService } from './imagen.service';

@Controller('imagen')
export class ImagenController {
    constructor(private readonly imagenService: ImagenService) {}


}
