import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Miembro } from './entities/miembro.entity';
import { CreateMiembroDto } from './dto/create-miembro.dto';
import { UpdateMiembroDto } from './dto/update-miembro.dto';
import { GrupoAccessService } from '../common/services/grupo-access.service';
import { UsuarioAutenticado } from '../common/decorators/current-user.decorator';

@Injectable()
export class MiembrosService {
  constructor(
    @InjectRepository(Miembro) private readonly miembrosRepo: Repository<Miembro>,
    private readonly grupoAccess: GrupoAccessService,
  ) {}

  private async verificarAccesoAlGrupo(idGrupo: number, usuario: UsuarioAutenticado) {
    if (usuario.rol === 'lider' && !(await this.grupoAccess.esGrupoDelLider(idGrupo, usuario.id))) {
      throw new ForbiddenException('No tienes acceso a este grupo');
    }
  }

  async crear(dto: CreateMiembroDto, usuario: UsuarioAutenticado) {
    await this.verificarAccesoAlGrupo(dto.id_grupo, usuario);
    const miembro = this.miembrosRepo.create(dto);
    return this.miembrosRepo.save(miembro);
  }

  async listarPorGrupo(idGrupo: number, usuario: UsuarioAutenticado) {
    await this.verificarAccesoAlGrupo(idGrupo, usuario);
    return this.miembrosRepo.find({ where: { id_grupo: idGrupo } });
  }

  private async obtenerOFallar(id: number) {
    const miembro = await this.miembrosRepo.findOne({ where: { id } });
    if (!miembro) throw new NotFoundException('Miembro no encontrado');
    return miembro;
  }

  async actualizar(id: number, dto: UpdateMiembroDto, usuario: UsuarioAutenticado) {
    const miembro = await this.obtenerOFallar(id);
    await this.verificarAccesoAlGrupo(miembro.id_grupo, usuario);
    await this.miembrosRepo.update(id, dto);
    return this.miembrosRepo.findOne({ where: { id } });
  }

  async eliminar(id: number, usuario: UsuarioAutenticado) {
    const miembro = await this.obtenerOFallar(id);
    await this.verificarAccesoAlGrupo(miembro.id_grupo, usuario);
    await this.miembrosRepo.delete(id);
    return { mensaje: 'Miembro eliminado' };
  }
}
