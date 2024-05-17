import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class CreateClienteDto {

    @IsString()
    @MinLength(4)
    nombre: string;

    @IsString()
    @MinLength(4)
    @IsOptional()
    apellido?: string;

    @IsString()
    @MinLength(8)    
    telefono: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    ci?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(2)
    @IsOptional()
    direccion?: string;

}
