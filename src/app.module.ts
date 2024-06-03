import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ChatbotOpenaiModule } from './chatbot-openai/chatbot-openai.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        // host: process.env.POSTGRES_HOST,
        // port: +process.env.POSTGRES_PORT,
        // database: process.env.POSTGRES_DATABASE,
        // username: process.env.POSTGRES_USERNAME,
        // password: process.env.POSTGRES_PASSWORD,
        entities: ['dist/src/**/*.entity{.ts,.js}'],
        autoLoadEntities: true, // Carga automaticamente las entidades
        synchronize: true,  // Realiza las migraciones automaticamente
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      }),
     }),
    ClientesModule,
    ChatbotOpenaiModule,
  ],

})
export class AppModule {}
