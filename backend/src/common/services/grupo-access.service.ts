import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from '../../grupos/entities/grupo.entity';

// Feature avanzada: autorizacion por rol A NIVEL DE DATO.
// No basta con saber que alguien es "lider" (eso ya lo dice el JWT); hay que confirmar
// que el grupo sobre el que quiere operar es realmente el suyo, consultando la BD.
@Injectable()
export class GrupoAccessService {
  constructor(@InjectRepository(Grupo) private readonly gruposRepo: Repository<Grupo>) {}

  async esGrupoDelLider(idGrupo: number, idUsuario: number): Promise<boolean> {
    const grupo = await this.gruposRepo.findOne({ where: { id: idGrupo, id_lider: idUsuario } });
    return !!grupo;
  }
}
