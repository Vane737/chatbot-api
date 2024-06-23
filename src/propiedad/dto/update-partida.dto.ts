import { PartialType } from '@nestjs/mapped-types';
import { CreatePropiedadDto } from './create-propiedad.dto';

export class UpdatePartidaDto extends PartialType(CreatePropiedadDto) {}
