import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum StatusAluno {
  PENDENTE = 'pendente', // aguardando aprovação do administrador
  ATIVO = 'ativo',
  AGUARDANDO = 'aguardando', // fila de espera
  REJEITADO = 'rejeitado',
  INATIVO = 'inativo',
}

@Entity('alunos')
export class Aluno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomeCompleto: string;

  @Column({ unique: true })
  cpfResponsavel: string; // LGPD: CPF do responsável legal (alunos a partir de 6 anos)

  @Column()
  nomeResponsavel: string;

  @Column()
  telefoneResponsavel: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column({ default: false })
  termoLgpdAssinado: boolean; // HU-01: trava LGPD obrigatória

  @Column({ nullable: true })
  termoLgpdAssinadoEm: Date;

  @Column({
    type: 'enum',
    enum: StatusAluno,
    default: StatusAluno.PENDENTE,
  })
  status: StatusAluno;

  @Column({ nullable: true, type: 'int' })
  posicaoFila: number; // HU-02: fila de espera

  @Column({ nullable: true })
  instrumentoDesejado: string; // violão, percussão, acordeon, canto

  @Column({ nullable: true })
  horarioPreferencial: string; // ex: "16h", "17h", "18h"

  @CreateDateColumn()
  criadoEm: Date; // timestamp para ordenação da fila

  @UpdateDateColumn()
  atualizadoEm: Date;
}
