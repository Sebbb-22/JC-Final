import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateGrupoDto } from './create-grupo.dto';

export class UpdateGrupoDto extends PartialType(OmitType(CreateGrupoDto, ['id_lider'] as const)) {}
