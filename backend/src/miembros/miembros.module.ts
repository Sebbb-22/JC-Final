import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Miembro } from './entities/miembro.entity';
import { MiembrosService } from './miembros.service';
import { MiembrosController } from './miembros.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Miembro]), CommonModule],
  controllers: [MiembrosController],
  providers: [MiembrosService],
  exports: [MiembrosService],
})
export class MiembrosModule {}
