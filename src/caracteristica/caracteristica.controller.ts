import { Body, Controller, Post } from '@nestjs/common';
import { CaracteristicaService } from './caracteristica.service';

import { CreateCaracteristicaDto } from './dto/create-caracteristica.dto';

@Controller('caracteristica')
export class CaracteristicaController {
    constructor(private readonly caracteristicaService: CaracteristicaService) {}

    @Post()
    async create(@Body() createCaracteristicaDto: CreateCaracteristicaDto) {
        const caracteristica = await this.caracteristicaService.create(createCaracteristicaDto);
        return caracteristica
    }
}
