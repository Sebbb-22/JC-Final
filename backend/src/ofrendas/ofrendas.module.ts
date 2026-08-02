import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ofrenda } from './entities/ofrenda.entity';
import { OfrendasService } from './ofrendas.service';
import { OfrendasController } from './ofrendas.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ofrenda]), CommonModule],
  controllers: [OfrendasController],
  providers: [OfrendasService],
  exports: [OfrendasService],
})
export class OfrendasModule {}
