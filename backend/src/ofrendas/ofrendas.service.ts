import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ofrenda } from './entities/ofrenda.entity';
import { CreateOfrendaDto } from './dto/create-ofrenda.dto';
import { GrupoAccessService } from '../common/services/grupo-access.service';
import { UsuarioAutenticado } from '../common/decorators/current-user.decorator';

@Injectable()
export class OfrendasService {
  constructor(
    @InjectRepository(Ofrenda) private readonly ofrendasRepo: Repository<Ofrenda>,
    private readonly grupoAccess: GrupoAccessService,
  ) {}

  private async verificarAccesoAlGrupo(idGrupo: number, usuario: UsuarioAutenticado) {
    if (usuario.rol === 'lider' && !(await this.grupoAccess.esGrupoDelLider(idGrupo, usuario.id))) {
      throw new ForbiddenException('No tienes acceso a este grupo');
    }
  }

  async registrar(dto: CreateOfrendaDto, usuario: UsuarioAutenticado) {
    await this.verificarAccesoAlGrupo(dto.id_grupo, usuario);
    const ofrenda = this.ofrendasRepo.create(dto);
    return this.ofrendasRepo.save(ofrenda);
  }

  async listarPorGrupo(idGrupo: number, usuario: UsuarioAutenticado) {
    await this.verificarAccesoAlGrupo(idGrupo, usuario);
    return this.ofrendasRepo.find({ where: { id_grupo: idGrupo }, order: { fecha: 'DESC' } });
  }
}
