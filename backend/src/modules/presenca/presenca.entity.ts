import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Aluno } from '../alunos/aluno.entity';

@Entity('registros_presenca')
export class RegistroPresenca {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Aluno, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aluno_id' })
  aluno: Aluno;

  @Column({ type: 'date' })
  data: Date;

  @Column({ default: false })
  presente: boolean;

  @Column({ nullable: true })
  conteudoAula: string; // diário de classe

  @Column({ nullable: true })
  professor: string;

  @Column({ nullable: true })
  observacoes: string;

  @CreateDateColumn()
  lancadoEm: Date; // para bloquear retroativos
}
