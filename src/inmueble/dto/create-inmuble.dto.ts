import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateInmubleDto {

    @IsString()
    nombre: string;

}
