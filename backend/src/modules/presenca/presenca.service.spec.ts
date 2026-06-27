import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PresencaService } from './presenca.service';
import { RegistroPresenca } from './presenca.entity';
import { Aluno } from '../alunos/aluno.entity';

function formatarData(date: Date): string {
  return date.toISOString().slice(0, 10);
}

describe('PresencaService', () => {
  let service: PresencaService;
  let presencaRepo: { [k: string]: jest.Mock };
  let alunoRepo: { [k: string]: jest.Mock };

  beforeEach(async () => {
    presencaRepo = {
      findOne: jest.fn(),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve(data)),
      find: jest.fn(),
    };
    alunoRepo = {
      findOne: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PresencaService,
        { provide: getRepositoryToken(RegistroPresenca), useValue: presencaRepo },
        { provide: getRepositoryToken(Aluno), useValue: alunoRepo },
      ],
    }).compile();

    service = moduleRef.get(PresencaService);
  });

  describe('lancar', () => {
    it('bloqueia lançamento retroativo além do limite permitido', async () => {
      const dataAntiga = new Date();
      dataAntiga.setDate(dataAntiga.getDate() - 5);

      await expect(
        service.lancar({ alunoId: 'a1', data: formatarData(dataAntiga), presente: true }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lança NotFoundException se o aluno não existe', async () => {
      alunoRepo.findOne.mockResolvedValue(null);
      await expect(
        service.lancar({ alunoId: 'a1', data: formatarData(new Date()), presente: true }),
      ).rejects.toThrow(NotFoundException);
    });

    it('cria um novo registro quando não existe presença para a data', async () => {
      alunoRepo.findOne.mockResolvedValue({ id: 'a1' });
      presencaRepo.findOne.mockResolvedValue(null);

      await service.lancar({ alunoId: 'a1', data: formatarData(new Date()), presente: true });

      expect(presencaRepo.create).toHaveBeenCalled();
      expect(presencaRepo.save).toHaveBeenCalled();
    });

    it('atualiza o registro existente em vez de duplicar (mesmo aluno+data)', async () => {
      alunoRepo.findOne.mockResolvedValue({ id: 'a1' });
      const existente = { id: 'reg-1', presente: false };
      presencaRepo.findOne.mockResolvedValue(existente);

      const resultado = await service.lancar({ alunoId: 'a1', data: formatarData(new Date()), presente: true });

      expect(presencaRepo.create).not.toHaveBeenCalled();
      expect(resultado.id).toBe('reg-1');
      expect(resultado.presente).toBe(true);
    });
  });

  describe('findByTurmaEData', () => {
    it('filtra por instrumento, horário e data', async () => {
      presencaRepo.find.mockResolvedValue([]);
      await service.findByTurmaEData('violão', '16h', '2026-06-27');
      expect(presencaRepo.find).toHaveBeenCalledWith({
        where: { data: new Date('2026-06-27'), aluno: { instrumentoDesejado: 'violão', horarioPreferencial: '16h' } },
        order: { lancadoEm: 'ASC' },
      });
    });
  });
});
