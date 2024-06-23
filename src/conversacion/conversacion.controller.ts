import { Controller } from '@nestjs/common';
import { ConversacionService } from './conversacion.service';

@Controller('conversacion')
export class ConversacionController {
    constructor(private readonly conversacionService: ConversacionService) {}
}
