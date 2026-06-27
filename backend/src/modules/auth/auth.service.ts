import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { PapelUsuario, Usuario } from './usuario.entity';
import { LoginDto } from './dto/login.dto';
import { CriarProfessorDto } from './dto/criar-professor.dto';
import { LoginResponseDto, UsuarioResponseDto } from './dto/usuario-response.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Garante a existência de um usuário administrador inicial
  async onModuleInit(): Promise<void> {
    const total = await this.usuarioRepo.count();
    if (total > 0) return;

    const nome = this.config.get<string>('ADMIN_NOME', 'Administrador SOAR');
    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@soar.org');
    const senha = this.config.get<string>('ADMIN_PASSWORD', 'soar@admin123');
    const rounds = Number(this.config.get('BCRYPT_ROUNDS', 10));

    const admin = this.usuarioRepo.create({
      nome,
      email,
      senhaHash: await bcrypt.hash(senha, rounds),
      papel: PapelUsuario.ADMIN,
    });
    await this.usuarioRepo.save(admin);
    this.logger.log(`Usuário administrador criado: ${email}`);
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const usuario = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const accessToken = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      papel: usuario.papel,
      alunoId: usuario.alunoId,
    });

    return { accessToken, usuario: this.toResponseDto(usuario) };
  }

  // Cria automaticamente uma conta de acesso para o aluno aprovado.
  // Login = e-mail informado na matrícula; senha inicial = CPF do responsável (somente números).
  async criarContaParaAluno(aluno: {
    id: string;
    nomeCompleto: string;
    email: string | null;
    cpfResponsavel: string;
  }): Promise<void> {
    if (!aluno.email) return;

    const existente = await this.usuarioRepo.findOne({ where: { email: aluno.email } });
    if (existente) return;

    const rounds = Number(this.config.get('BCRYPT_ROUNDS', 10));
    const senha = aluno.cpfResponsavel.replace(/\D/g, '');

    const usuario = this.usuarioRepo.create({
      nome: aluno.nomeCompleto,
      email: aluno.email,
      senhaHash: await bcrypt.hash(senha, rounds),
      papel: PapelUsuario.ALUNO,
      alunoId: aluno.id,
    });
    await this.usuarioRepo.save(usuario);
    this.logger.log(`Conta de acesso criada para o aluno: ${aluno.email}`);
  }

  // Remove a conta de acesso vinculada a um aluno excluído
  async removerContaPorAluno(alunoId: string): Promise<void> {
    await this.usuarioRepo.delete({ alunoId });
  }

  async listarProfessores(): Promise<UsuarioResponseDto[]> {
    const professores = await this.usuarioRepo.find({
      where: { papel: PapelUsuario.PROFESSOR },
      order: { nome: 'ASC' },
    });
    return professores.map((p) => this.toResponseDto(p));
  }

  async criarProfessor(dto: CriarProfessorDto): Promise<UsuarioResponseDto> {
    const existente = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (existente) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const rounds = Number(this.config.get('BCRYPT_ROUNDS', 10));
    const professor = this.usuarioRepo.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash: await bcrypt.hash(dto.senha, rounds),
      papel: PapelUsuario.PROFESSOR,
    });
    const salvo = await this.usuarioRepo.save(professor);
    return this.toResponseDto(salvo);
  }

  async me(id: string): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    return this.toResponseDto(usuario);
  }

  private toResponseDto(usuario: Usuario): UsuarioResponseDto {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      alunoId: usuario.alunoId,
    };
  }
}
