import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { ReportesService } from './reportes.service';

@Controller('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('semanal')
  reporteSemanal(@Query('inicio') inicio: string, @Query('fin') fin: string) {
    return this.reportesService.reporteSemanal(inicio, fin);
  }

  @Get('asistencia-baja')
  asistenciaBaja() {
    return this.reportesService.asistenciaBaja();
  }
}
