import { Test } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlunosService } from './alunos.service';
import { Aluno, StatusAluno } from './aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { AuthService } from '../auth/auth.service';
import { VAGAS_POR_HORARIO } from './constants';

describe('AlunosService', () => {
  let service: AlunosService;
  let alunoRepo: { [k: string]: jest.Mock };
  let presencaRepo: { [k: string]: jest.Mock };
  let authService: { [k: string]: jest.Mock };

  beforeEach(async () => {
    alunoRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve(data)),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    presencaRepo = {
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      })),
    };
    authService = {
      criarContaParaAluno: jest.fn(),
      removerContaPorAluno: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AlunosService,
        { provide: getRepositoryToken(Aluno), useValue: alunoRepo },
        { provide: getRepositoryToken(RegistroPresenca), useValue: presencaRepo },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    service = moduleRef.get(AlunosService);
  });

  describe('matricular', () => {
    const dtoBase = {
      nomeCompleto: 'Criança Teste',
      cpfResponsavel: '111.222.333-44',
      telefoneResponsavel: '(88) 99999-0000',
      dataNascimento: '2015-01-01',
      termoLgpdAssinado: true,
    };

    it('rejeita quando o termo LGPD não foi aceito', async () => {
      await expect(service.matricular({ ...dtoBase, termoLgpdAssinado: false })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejeita CPF do responsável duplicado', async () => {
      alunoRepo.findOne.mockResolvedValue({ id: 'outro' });
      await expect(service.matricular(dtoBase)).rejects.toThrow(ConflictException);
    });

    it('cria o aluno como PENDENTE e não expõe o CPF na resposta', async () => {
      alunoRepo.findOne.mockResolvedValue(null);
      const resultado = await service.matricular(dtoBase);

      expect(resultado.status).toBe(StatusAluno.PENDENTE);
      expect((resultado as any).cpfResponsavel).toBeUndefined();
    });
  });

  describe('aprovar', () => {
    it('lança NotFoundException se o aluno não existe', async () => {
      alunoRepo.findOne.mockResolvedValue(null);
      await expect(service.aprovar('id-inexistente')).rejects.toThrow(NotFoundException);
    });

    it('rejeita se a matrícula já foi avaliada', async () => {
      alunoRepo.findOne.mockResolvedValue({ id: '1', status: StatusAluno.ATIVO });
      await expect(service.aprovar('1')).rejects.toThrow(BadRequestException);
    });

    it('vira ATIVO quando há vaga disponível', async () => {
      alunoRepo.findOne.mockResolvedValue({ id: '1', status: StatusAluno.PENDENTE, horarioPreferencial: '16h' });
      alunoRepo.count.mockResolvedValue(0); // ninguém ocupando ainda

      const resultado = await service.aprovar('1');

      expect(resultado.status).toBe(StatusAluno.ATIVO);
      expect(resultado.posicaoFila).toBeNull();
      expect(authService.criarContaParaAluno).toHaveBeenCalled();
    });

    it('vira AGUARDANDO (fila de espera) quando as vagas estão cheias', async () => {
      alunoRepo.findOne
        .mockResolvedValueOnce({ id: '1', status: StatusAluno.PENDENTE, horarioPreferencial: '16h' })
        .mockResolvedValueOnce(null); // proximaPosicaoFila: fila ainda vazia
      alunoRepo.count.mockResolvedValue(VAGAS_POR_HORARIO); // todas as vagas ocupadas

      const resultado = await service.aprovar('1');

      expect(resultado.status).toBe(StatusAluno.AGUARDANDO);
      expect(resultado.posicaoFila).toBe(1);
    });
  });

  describe('rejeitar', () => {
    it('lança NotFoundException se o aluno não existe', async () => {
      alunoRepo.findOne.mockResolvedValue(null);
      await expect(service.rejeitar('id-inexistente')).rejects.toThrow(NotFoundException);
    });

    it('marca como REJEITADO', async () => {
      alunoRepo.findOne.mockResolvedValue({ id: '1', status: StatusAluno.PENDENTE });
      const resultado = await service.rejeitar('1');
      expect(resultado.status).toBe(StatusAluno.REJEITADO);
    });
  });

  describe('excluir', () => {
    it('lança NotFoundException se o aluno não existe', async () => {
      alunoRepo.findOne.mockResolvedValue(null);
      await expect(service.excluir('id-inexistente')).rejects.toThrow(NotFoundException);
    });

    it('remove a conta vinculada e depois o aluno', async () => {
      const aluno = { id: '1', nomeCompleto: 'Teste' };
      alunoRepo.findOne.mockResolvedValue(aluno);

      await service.excluir('1');

      expect(authService.removerContaPorAluno).toHaveBeenCalledWith('1');
      expect(alunoRepo.remove).toHaveBeenCalledWith(aluno);
    });
  });
});
