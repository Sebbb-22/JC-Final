import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateOfrendaDto {
  @IsInt()
  id_grupo: number;

  @IsDateString()
  fecha: string;

  @IsPositive()
  monto: number;
}
