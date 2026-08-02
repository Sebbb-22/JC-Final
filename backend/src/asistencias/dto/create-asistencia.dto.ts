import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { TipoAsistencia } from '../entities/asistencia.entity';

export class CreateAsistenciaDto {
  @IsInt()
  id_miembro: number;

  @IsInt()
  id_grupo: number;

  @IsDateString()
  fecha: string;

  @IsEnum(TipoAsistencia)
  tipo: TipoAsistencia;

  @IsBoolean()
  @IsOptional()
  asistio?: boolean;
}
