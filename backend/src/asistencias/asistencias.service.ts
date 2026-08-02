import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { GrupoAccessService } from '../common/services/grupo-access.service';
import { UsuarioAutenticado } from '../common/decorators/current-user.decorator';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencia) private readonly asistenciasRepo: Repository<Asistencia>,
    private readonly grupoAccess: GrupoAccessService,
  ) {}

  private async verificarAccesoAlGrupo(idGrupo: number, usuario: UsuarioAutenticado) {
    if (usuario.rol === 'lider' && !(await this.grupoAccess.esGrupoDelLider(idGrupo, usuario.id))) {
      throw new ForbiddenException('No tienes acceso a este grupo');
    }
  }

  async registrar(dto: CreateAsistenciaDto, usuario: UsuarioAutenticado) {
    await this.verificarAccesoAlGrupo(dto.id_grupo, usuario);
    const asistencia = this.asistenciasRepo.create(dto);
    return this.asistenciasRepo.save(asistencia);
  }

  async listarPorGrupo(idGrupo: number, usuario: UsuarioAutenticado) {
    await this.verificarAccesoAlGrupo(idGrupo, usuario);
    return this.asistenciasRepo.find({
      where: { id_grupo: idGrupo },
      relations: ['miembro'],
      order: { fecha: 'DESC' },
    });
  }
}
