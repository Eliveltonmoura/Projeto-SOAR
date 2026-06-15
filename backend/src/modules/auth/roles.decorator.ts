import { SetMetadata } from '@nestjs/common';
import { PapelUsuario } from './usuario.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: PapelUsuario[]) => SetMetadata(ROLES_KEY, roles);
