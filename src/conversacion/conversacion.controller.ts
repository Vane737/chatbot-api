import { Controller, Param, Post } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http';
import { ConversacionService } from './conversacion.service';

@Controller('conversacion')
export class ConversacionController {
    constructor(private readonly conversacionService: ConversacionService) {}
    /*
    @Post('create/:id')
    findOne(@Param('id') id: number) {
        return this.conversacionService.create(id);
    }

    @Get('comparar/:id')
    comparar(@Param('id') id: number) {
        return this.conversacionService.comparar(id);
    }
    */
   
}
