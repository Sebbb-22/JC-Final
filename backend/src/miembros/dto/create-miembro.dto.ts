import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateMiembroDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  edad?: number;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsInt()
  id_grupo: number;
}
