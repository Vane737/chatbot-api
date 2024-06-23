import { Body, Controller, Post } from '@nestjs/common';

import { InmuebleService } from './inmueble.service';
import { CreateInmubleDto } from './dto/create-inmuble.dto';

@Controller('inmueble')
export class InmuebleController {

    constructor(private readonly inmuebleService: InmuebleService) {}
      
    @Post()
    async create(@Body() createInmubleDto: CreateInmubleDto) {
        const inmuble = await this.inmuebleService.create(createInmubleDto);
        return inmuble
    }
    


    
}
