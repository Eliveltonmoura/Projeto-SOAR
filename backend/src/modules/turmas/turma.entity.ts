import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Usuario } from '../auth/usuario.entity';

// Vínculo formal turma (instrumento + horário) ↔ professor responsável
@Entity('turmas')
@Unique(['instrumento', 'horario'])
export class Turma {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  instrumento: string;

  @Column()
  horario: string;

  @ManyToOne(() => Usuario, { eager: true, nullable: true })
  @JoinColumn({ name: 'professor_id' })
  professor: Usuario | null;

  @CreateDateColumn()
  criadoEm: Date;
}
