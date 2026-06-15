import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum PapelUsuario {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  ALUNO = 'aluno',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senhaHash: string;

  @Column({
    type: 'enum',
    enum: PapelUsuario,
    default: PapelUsuario.PROFESSOR,
  })
  papel: PapelUsuario;

  @Column({ type: 'uuid', nullable: true })
  alunoId: string | null; // vínculo com Aluno, quando papel = ALUNO

  @CreateDateColumn()
  criadoEm: Date;
}
