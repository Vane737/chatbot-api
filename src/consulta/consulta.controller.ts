import { Controller } from '@nestjs/common';
import { ConsultaService } from './consulta.service';

@Controller('consulta')
export class ConsultaController {
    constructor(private readonly consultaService: ConsultaService) {}

}
