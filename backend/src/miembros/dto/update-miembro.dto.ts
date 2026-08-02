import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateMiembroDto } from './create-miembro.dto';

export class UpdateMiembroDto extends PartialType(OmitType(CreateMiembroDto, ['id_grupo'] as const)) {}
