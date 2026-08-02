import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

@Injectable()
export class GruposService {
  constructor(@InjectRepository(Grupo) private readonly gruposRepo: Repository<Grupo>) {}

  crear(dto: CreateGrupoDto) {
    const grupo = this.gruposRepo.create(dto);
    return this.gruposRepo.save(grupo);
  }

  listarTodos() {
    return this.gruposRepo.find({ relations: ['lider'] });
  }

  listarDelLider(idLider: number) {
    return this.gruposRepo.find({ where: { id_lider: idLider }, relations: ['lider'] });
  }

  async obtenerUno(id: number) {
    const grupo = await this.gruposRepo.findOne({ where: { id }, relations: ['lider'] });
    if (!grupo) throw new NotFoundException('Grupo no encontrado');
    return grupo;
  }

  async actualizar(id: number, dto: UpdateGrupoDto) {
    await this.obtenerUno(id);
    await this.gruposRepo.update(id, dto);
    return this.obtenerUno(id);
  }

  async eliminar(id: number) {
    await this.obtenerUno(id);
    await this.gruposRepo.delete(id);
    return { mensaje: 'Grupo eliminado' };
  }
}
