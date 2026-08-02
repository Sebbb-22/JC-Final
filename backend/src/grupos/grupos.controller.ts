import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, UsuarioAutenticado } from '../common/decorators/current-user.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { MiembrosService } from '../miembros/miembros.service';
import { AsistenciasService } from '../asistencias/asistencias.service';
import { OfrendasService } from '../ofrendas/ofrendas.service';

@Controller('grupos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GruposController {
  constructor(
    private readonly gruposService: GruposService,
    private readonly miembrosService: MiembrosService,
    private readonly asistenciasService: AsistenciasService,
    private readonly ofrendasService: OfrendasService,
  ) {}

  @Post()
  @Roles(RolUsuario.ADMIN)
  crear(@Body() dto: CreateGrupoDto) {
    return this.gruposService.crear(dto);
  }

  @Get()
  listar(@CurrentUser() usuario: UsuarioAutenticado) {
    return usuario.rol === 'admin' ? this.gruposService.listarTodos() : this.gruposService.listarDelLider(usuario.id);
  }

  @Get(':id')
  async obtenerUno(@Param('id', ParseIntPipe) id: number, @CurrentUser() usuario: UsuarioAutenticado) {
    const grupo = await this.gruposService.obtenerUno(id);
    if (usuario.rol === 'lider' && grupo.id_lider !== usuario.id) {
      throw new ForbiddenException('No tienes acceso a este grupo');
    }
    return grupo;
  }

  @Put(':id')
  @Roles(RolUsuario.ADMIN)
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGrupoDto) {
    return this.gruposService.actualizar(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.eliminar(id);
  }

  @Get(':idGrupo/miembros')
  miembrosDelGrupo(@Param('idGrupo', ParseIntPipe) idGrupo: number, @CurrentUser() usuario: UsuarioAutenticado) {
    return this.miembrosService.listarPorGrupo(idGrupo, usuario);
  }

  @Get(':idGrupo/asistencias')
  asistenciasDelGrupo(@Param('idGrupo', ParseIntPipe) idGrupo: number, @CurrentUser() usuario: UsuarioAutenticado) {
    return this.asistenciasService.listarPorGrupo(idGrupo, usuario);
  }

  @Get(':idGrupo/ofrendas')
  ofrendasDelGrupo(@Param('idGrupo', ParseIntPipe) idGrupo: number, @CurrentUser() usuario: UsuarioAutenticado) {
    return this.ofrendasService.listarPorGrupo(idGrupo, usuario);
  }
}
