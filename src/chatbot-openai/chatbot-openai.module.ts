import { Module } from '@nestjs/common';
import { ChatbotOpenaiService } from './chatbot-openai.service';
import { ChatbotOpenaiController } from './chatbot-openai.controller';
import { ClientesService } from 'src/clientes/clientes.service';
import { ClientesModule } from 'src/clientes/clientes.module';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { VectorEntity } from './entities/vector.entity';

@Module({
  controllers: [ChatbotOpenaiController],
  providers: [ChatbotOpenaiService, ClientesService],
  imports: [
    TypeOrmModule.forFeature([Cliente], 'primary'), // Repositorio para la conexión primaria
    // TypeOrmModule.forFeature([VectorEntity], 'supabase'), // Repositorio para la conexión de Supabase
    ClientesModule,
  ]
})
export class ChatbotOpenaiModule {}
