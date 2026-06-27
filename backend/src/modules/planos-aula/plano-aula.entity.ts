import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('planos_aula')
export class PlanoAula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  instrumento: string;

  @Column()
  horario: string;

  @Column({ type: 'date' })
  data: Date;

  @Column()
  tema: string;

  @Column({ type: 'text' })
  objetivo: string;

  @Column({ type: 'text' })
  conteudo: string;

  @Column({ type: 'text', nullable: true })
  materiais: string | null;

  @Column({ nullable: true })
  professor: string | null;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
