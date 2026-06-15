import { PapelUsuario } from '../usuario.entity';

// DTO de resposta — nunca expõe senhaHash
export class UsuarioResponseDto {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  alunoId?: string | null;
}

export class LoginResponseDto {
  accessToken: string;
  usuario: UsuarioResponseDto;
}
