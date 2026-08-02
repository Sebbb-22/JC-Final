import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UsuarioAutenticado } from '../common/decorators/current-user.decorator';
import { MiembrosService } from './miembros.service';
import { CreateMiembroDto } from './dto/create-miembro.dto';
import { UpdateMiembroDto } from './dto/update-miembro.dto';

@Controller('miembros')
@UseGuards(JwtAuthGuard)
export class MiembrosController {
  constructor(private readonly miembrosService: MiembrosService) {}

  @Post()
  crear(@Body() dto: CreateMiembroDto, @CurrentUser() usuario: UsuarioAutenticado) {
    return this.miembrosService.crear(dto, usuario);
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMiembroDto,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    return this.miembrosService.actualizar(id, dto, usuario);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number, @CurrentUser() usuario: UsuarioAutenticado) {
    return this.miembrosService.eliminar(id, usuario);
  }
}
