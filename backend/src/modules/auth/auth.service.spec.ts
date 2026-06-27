import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PapelUsuario, Usuario } from './usuario.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usuarioRepo: { [k: string]: jest.Mock };

  beforeEach(async () => {
    usuarioRepo = {
      count: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve({ id: 'novo-id', ...data })),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Usuario), useValue: usuarioRepo },
        { provide: JwtService, useValue: { sign: jest.fn(() => 'token-fake') } },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((_key: string, fallback?: unknown) => fallback) },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('login', () => {
    it('rejeita quando o e-mail não existe', async () => {
      usuarioRepo.findOne.mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', senha: '123456' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('rejeita quando a senha está errada', async () => {
      const senhaHash = await bcrypt.hash('senhaCorreta', 4);
      usuarioRepo.findOne.mockResolvedValue({ id: '1', email: 'x@x.com', senhaHash, papel: PapelUsuario.ADMIN });
      await expect(service.login({ email: 'x@x.com', senha: 'senhaErrada' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('retorna o token quando as credenciais são válidas', async () => {
      const senhaHash = await bcrypt.hash('senhaCorreta', 4);
      usuarioRepo.findOne.mockResolvedValue({
        id: '1', nome: 'Admin', email: 'x@x.com', senhaHash, papel: PapelUsuario.ADMIN, alunoId: null,
      });

      const resultado = await service.login({ email: 'x@x.com', senha: 'senhaCorreta' });

      expect(resultado.accessToken).toBe('token-fake');
      expect(resultado.usuario).toEqual({ id: '1', nome: 'Admin', email: 'x@x.com', papel: PapelUsuario.ADMIN, alunoId: null });
    });
  });

  describe('criarProfessor', () => {
    it('rejeita e-mail já cadastrado', async () => {
      usuarioRepo.findOne.mockResolvedValue({ id: 'existente' });
      await expect(
        service.criarProfessor({ nome: 'Prof', email: 'prof@x.com', senha: 'senha123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('cria o professor com papel PROFESSOR', async () => {
      usuarioRepo.findOne.mockResolvedValue(null);
      const resultado = await service.criarProfessor({ nome: 'Prof', email: 'prof@x.com', senha: 'senha123' });

      expect(resultado.papel).toBe(PapelUsuario.PROFESSOR);
      expect(usuarioRepo.save).toHaveBeenCalled();
    });
  });

  describe('removerContaPorAluno', () => {
    it('remove a conta pelo alunoId', async () => {
      await service.removerContaPorAluno('aluno-1');
      expect(usuarioRepo.delete).toHaveBeenCalledWith({ alunoId: 'aluno-1' });
    });
  });

  describe('onModuleInit', () => {
    it('não cria admin se já existir algum usuário', async () => {
      usuarioRepo.count.mockResolvedValue(1);
      await service.onModuleInit();
      expect(usuarioRepo.save).not.toHaveBeenCalled();
    });

    it('cria o admin inicial quando a tabela está vazia', async () => {
      usuarioRepo.count.mockResolvedValue(0);
      await service.onModuleInit();
      expect(usuarioRepo.save).toHaveBeenCalled();
    });
  });
});
