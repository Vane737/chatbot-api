import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {

  private readonly logger = new Logger('ClienteService')
  
  constructor( 

    @InjectRepository(Cliente) 
    private readonly clienteRepository: Repository<Cliente>
  
  ) { }

  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepository.create( createClienteDto );
      await this.clienteRepository.save( cliente );

      return cliente;

    } catch (error) {      
      console.log(error);
      this.handleExceptions( error ); 
    }
  }

  findAll() {
    return this.clienteRepository.find({})
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if ( !cliente ) {
      throw new NotFoundException(`El cliente con el id ${ id } no fue encontrado.`)
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.findOneBy({ id });

    console.log(cliente);
    
    if (!cliente) {
      throw new NotFoundException(`Banco con el id ${id} no encontrado`);
    }

    // Actualiza las propiedades del cliente según el DTO
    if (updateClienteDto.nombre) {
      cliente.nombre = updateClienteDto.nombre;
    }
    
    // Guarda el cliente actualizado
    await this.clienteRepository.save(cliente);

    return cliente;
  }

  async findByPhone(telefono: string) {
    const cliente = await this.clienteRepository.findOneBy({ telefono });
    if (!cliente) {

      return null;
    }
    return cliente;
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove( cliente );
  }


  private handleExceptions( error: any ) {
    if( error.code === '23505')
      throw new BadRequestException( error.detail );

    this.logger.error( error )

    throw new InternalServerErrorException('Error al conectar al servidor')
  }
}
