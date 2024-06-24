import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';


enum Tipo {
  Alquiler = 'Alquiler',
  Venta = 'Venta',
}
export class CreatePropiedadDto {

    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsString()
    @IsNotEmpty()
    superficie: string;

    @IsString()
    @IsNotEmpty()
    precio: string;

    @IsEnum(Tipo)
    tipo: 'Alquiler' | 'Venta';

    @IsBoolean()
    @IsOptional()
    registrado?: boolean = false;

    @IsNumber()
    @IsNotEmpty()
    inmuebleId: number;
}
