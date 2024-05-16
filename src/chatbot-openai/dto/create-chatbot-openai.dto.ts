import { IsString, MinLength } from "class-validator";

export class CreateChatbotOpenaiDto {

    @IsString()
    @MinLength(8)
    telefono: string;

    @IsString()
    @MinLength(2)
    prompt: string;

}
