import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientesService } from 'src/clientes/clientes.service';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { ConsultaService } from 'src/consulta/consulta.service';
import { ThisMonthInstance } from 'twilio/lib/rest/api/v2010/account/usage/record/thisMonth';
import { Repository } from 'typeorm';

import { Conversacion } from './entities/conversacion.entity';

@Injectable()
export class ConversacionService {
    private readonly logger = new Logger('ConversacionService')
    constructor( 
        @InjectRepository(Conversacion, 'primary') private readonly conversacionRepository: Repository<Conversacion>,
        private readonly consultaService: ConsultaService
      ){}

    async create(cliente:Cliente){
      var fecha = new Date();
      const conversacion = this.conversacionRepository.create({
        fechaInicio:fecha,
        cliente
      });
      await this.conversacionRepository.save(conversacion);
      return conversacion;
    }

    async comparar(cliente:Cliente){
      var fecha = new Date();
      const conversacion = await this.conversacionRepository.findOne({
        where: { 
          cliente: cliente,
          fechaInicio: fecha        
        },
      });
      return conversacion;
    }

    async eliminarConsultas(conversacion:Conversacion){
      await this.consultaService.eliminarConsultas(conversacion);
    }

}
