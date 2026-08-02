import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { DiaSemana } from '../entities/grupo.entity';

export class CreateGrupoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  id_lider: number;

  @IsEnum(DiaSemana)
  dia_semana: DiaSemana;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, { message: 'hora debe tener formato HH:MM' })
  hora: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;
}
