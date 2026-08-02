import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private readonly usuariosRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const usuario = await this.usuariosRepo
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.username = :username', { username })
      .getOne();
    if (!usuario) throw new UnauthorizedException('Credenciales invalidas');

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) throw new UnauthorizedException('Credenciales invalidas');

    const token = this.jwtService.sign({
      sub: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    });

    return {
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    };
  }
}
