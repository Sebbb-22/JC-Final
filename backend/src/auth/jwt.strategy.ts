import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dev_secret_cambia_esto'),
    });
  }

  // Lo que retorna aqui queda disponible como request.user en toda la app.
  async validate(payload: { sub: number; nombre: string; rol: 'admin' | 'lider' }) {
    return { id: payload.sub, nombre: payload.nombre, rol: payload.rol };
  }
}
