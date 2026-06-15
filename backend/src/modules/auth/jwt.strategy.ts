import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PapelUsuario } from './usuario.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  nome: string;
  papel: PapelUsuario;
  alunoId?: string | null;
}

export interface UsuarioAutenticado {
  id: string;
  email: string;
  nome: string;
  papel: PapelUsuario;
  alunoId?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): UsuarioAutenticado {
    return {
      id: payload.sub,
      email: payload.email,
      nome: payload.nome,
      papel: payload.papel,
      alunoId: payload.alunoId ?? null,
    };
  }
}
