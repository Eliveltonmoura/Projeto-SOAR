import { Test } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TurmasService } from './turmas.service';
import { Aluno } from '../alunos/aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { Turma } from './turma.entity';

function mockQueryBuilder(rows: any[]) {
  return {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    addGroupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(rows),
  };
}

describe('TurmasService', () => {
  let service: TurmasService;
  let alunoRepo: { [k: string]: jest.Mock };
  let presencaRepo: { [k: string]: jest.Mock };
  let turmaRepo: { [k: string]: jest.Mock };

  beforeEach(async () => {
    alunoRepo = {
      createQueryBuilder: jest.fn(() => mockQueryBuilder([])),
      find: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    };
    presencaRepo = {
      createQueryBuilder: jest.fn(() => mockQueryBuilder([])),
    };
    turmaRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve(data)),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TurmasService,
        { provide: getRepositoryToken(Aluno), useValue: alunoRepo },
        { provide: getRepositoryToken(RegistroPresenca), useValue: presencaRepo },
        { provide: getRepositoryToken(Turma), useValue: turmaRepo },
      ],
    }).compile();

    service = moduleRef.get(TurmasService);
  });

  describe('listar', () => {
    it('inclui turmas formais mesmo sem nenhum aluno', async () => {
      turmaRepo.find.mockResolvedValue([{ instrumento: 'canto', horario: '19h', professor: null }]);

      const turmas = await service.listar();

      expect(turmas).toHaveLength(1);
      expect(turmas[0]).toMatchObject({ instrumento: 'canto', horario: '19h', alunos: 0 });
    });

    it('junta a contagem de alunos ativos com o vínculo formal de professor', async () => {
      alunoRepo.createQueryBuilder.mockReturnValue(
        mockQueryBuilder([{ instrumento: 'violão', horario: '16h', alunos: '3' }]),
      );
      turmaRepo.find.mockResolvedValue([
        { instrumento: 'violão', horario: '16h', professor: { id: 'prof-1', nome: 'Ana' } },
      ]);

      const turmas = await service.listar();

      expect(turmas[0]).toMatchObject({ alunos: 3, professor: 'Ana', professorId: 'prof-1' });
    });
  });

  describe('criar', () => {
    it('rejeita turma duplicada (mesmo instrumento + horário)', async () => {
      turmaRepo.findOne.mockResolvedValue({ instrumento: 'canto', horario: '19h' });
      await expect(service.criar({ instrumento: 'canto', horario: '19h' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('cria a turma sem professor quando não informado', async () => {
      turmaRepo.findOne.mockResolvedValue(null);
      // simula o que o listar() interno enxergaria após o save()
      turmaRepo.find.mockResolvedValue([{ instrumento: 'canto', horario: '19h', professor: null }]);

      const turma = await service.criar({ instrumento: 'canto', horario: '19h' });

      expect(turma.professorId).toBeNull();
      expect(turmaRepo.save).toHaveBeenCalled();
    });
  });

  describe('excluirTurma', () => {
    it('rejeita excluir turma com alunos ativos', async () => {
      alunoRepo.count.mockResolvedValue(2);
      await expect(service.excluirTurma('violão', '16h')).rejects.toThrow(ConflictException);
      expect(turmaRepo.delete).not.toHaveBeenCalled();
    });

    it('exclui normalmente quando não há aluno ativo', async () => {
      alunoRepo.count.mockResolvedValue(0);
      await service.excluirTurma('canto', '19h');
      expect(turmaRepo.delete).toHaveBeenCalledWith({ instrumento: 'canto', horario: '19h' });
    });
  });

  describe('atribuirProfessor', () => {
    it('cria o registro formal da turma se ele ainda não existir', async () => {
      turmaRepo.findOne.mockResolvedValue(null);
      await service.atribuirProfessor('canto', '19h', 'prof-1');
      expect(turmaRepo.create).toHaveBeenCalledWith({ instrumento: 'canto', horario: '19h' });
      expect(turmaRepo.save).toHaveBeenCalled();
    });
  });
});
