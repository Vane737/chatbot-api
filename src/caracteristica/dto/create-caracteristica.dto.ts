import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCaracteristicaDto {

    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    propiedadId: number;

}
