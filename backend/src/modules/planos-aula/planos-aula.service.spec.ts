import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanosAulaService } from './planos-aula.service';
import { PlanoAula } from './plano-aula.entity';

describe('PlanosAulaService', () => {
  let service: PlanosAulaService;
  let planoRepo: { [k: string]: jest.Mock };

  beforeEach(async () => {
    planoRepo = {
      findOne: jest.fn(),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve(data)),
      find: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [PlanosAulaService, { provide: getRepositoryToken(PlanoAula), useValue: planoRepo }],
    }).compile();

    service = moduleRef.get(PlanosAulaService);
  });

  const dto = { instrumento: 'violão', horario: '16h', data: '2026-06-27', tema: 'Acordes', objetivo: 'Aprender', conteudo: 'Dó, Ré, Mi' };

  it('cria um novo plano quando não existe um para a turma+data', async () => {
    planoRepo.findOne.mockResolvedValue(null);

    const plano = await service.salvar(dto, 'Prof. Ana');

    expect(planoRepo.create).toHaveBeenCalled();
    expect(plano.professor).toBe('Prof. Ana');
  });

  it('atualiza o plano existente em vez de duplicar (mesma turma+data)', async () => {
    const existente = { id: 'plano-1', instrumento: 'violão', horario: '16h', tema: 'Antigo', professor: 'Antigo Professor' };
    planoRepo.findOne.mockResolvedValue(existente);

    const plano = await service.salvar(dto, 'Prof. Ana');

    expect(plano.id).toBe('plano-1');
    expect(plano.tema).toBe('Acordes');
    expect(plano.professor).toBe('Prof. Ana');
  });

  it('mantém o professor anterior se nenhum for informado na atualização', async () => {
    const existente = { id: 'plano-1', instrumento: 'violão', horario: '16h', professor: 'Professor Original' };
    planoRepo.findOne.mockResolvedValue(existente);

    const plano = await service.salvar(dto);

    expect(plano.professor).toBe('Professor Original');
  });

  it('lista o histórico de planos de uma turma ordenado por data', async () => {
    planoRepo.find.mockResolvedValue([{ id: '1' }]);
    const historico = await service.listarPorTurma('violão', '16h');
    expect(planoRepo.find).toHaveBeenCalledWith({
      where: { instrumento: 'violão', horario: '16h' },
      order: { data: 'DESC' },
    });
    expect(historico).toHaveLength(1);
  });
});
