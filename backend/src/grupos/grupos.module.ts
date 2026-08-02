import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { MiembrosModule } from '../miembros/miembros.module';
import { AsistenciasModule } from '../asistencias/asistencias.module';
import { OfrendasModule } from '../ofrendas/ofrendas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo]), MiembrosModule, AsistenciasModule, OfrendasModule],
  controllers: [GruposController],
  providers: [GruposService],
})
export class GruposModule {}
