import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from '../grupos/entities/grupo.entity';
import { GrupoAccessService } from './services/grupo-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo])],
  providers: [GrupoAccessService],
  exports: [GrupoAccessService],
})
export class CommonModule {}
