import { Controller } from '@nestjs/common';
import { CitaService } from './cita.service';

@Controller('cita')
export class CitaController {
    constructor(private readonly citaService: CitaService) {}

}
