import { Body, Controller, Post } from '@nestjs/common';
import { CreatePropiedadDto } from './dto/create-propiedad.dto';
import { PropiedadService } from './propiedad.service';

@Controller('propiedad')
export class PropiedadController {
    constructor(private readonly propiedadService: PropiedadService) {}

    @Post()
    async create(@Body() createPropiedadDto: CreatePropiedadDto) {        
        const propiedad = await this.propiedadService.create( createPropiedadDto );        
        return propiedad;        
    }  


}
