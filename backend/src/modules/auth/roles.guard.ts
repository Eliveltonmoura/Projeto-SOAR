import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { PapelUsuario } from './usuario.entity';
import { UsuarioAutenticado } from './jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<PapelUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolesPermitidos || rolesPermitidos.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<{ user: UsuarioAutenticado }>();
    if (!rolesPermitidos.includes(user?.papel)) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
    }
    return true;
  }
}
