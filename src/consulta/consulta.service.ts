import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversacion } from 'src/conversacion/entities/conversacion.entity';
import { Repository } from 'typeorm';

import { Consulta } from './entities/consulta.entity';


@Injectable()
export class ConsultaService {
  
  private readonly logger = new Logger('ConsultaService')
  constructor( 
    @InjectRepository(Consulta, 'primary') private readonly consultaRepository: Repository<Consulta>
  ){}


  async eliminarConsultas(conversacion:Conversacion){
    const consultas = await this.consultaRepository.find({ where: { conversacion } });
    if (consultas.length === 0) {
      this.logger.log(`No se encontraron consultas para la conversación con ID ${conversacion.id}`);
      return;
    }
    await this.consultaRepository.remove(consultas);
    this.logger.log(`Eliminadas ${consultas.length} consultas para la conversación con ID ${conversacion.id}`);
  }

  async create(rol: string, body: string,esCasa: boolean, conversacion: Conversacion){
    try {
      var fecha = new Date();
      const consulta = this.consultaRepository.create({
        rol:rol,
        body:body,
        esCasa:esCasa,
        fecha:fecha,
        conversacion:conversacion
      });
      await this.consultaRepository.save(consulta);

    } catch (error) {
      this.logger.error(`Error al crear la consulta: ${error.message}`);
      throw error;
    }
  }

  async buscarCasa(conversacion:Conversacion){
    const consulta = await this.consultaRepository.findOne({ 
      where: { 
        rol:'user',
        esCasa:true,
        conversacion:conversacion 
      } 
    });    
    if(!consulta){
      return null;
    }else{
      return consulta.body;
    }

  }

  async getConsultas(conversacion:Conversacion){
    const consultas = await this.consultaRepository.find({ 
      where: { 
        conversacion:conversacion 
      } 
    });    
    if(!consultas){
      return null;
    }else{
      return consultas;
    }

  }


}
