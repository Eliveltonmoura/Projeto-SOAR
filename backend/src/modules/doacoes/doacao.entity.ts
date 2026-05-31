import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum StatusDoacao {
  PENDENTE = 'pendente',     // aguardando conferência
  CONFIRMADO = 'confirmado',
  REJEITADO = 'rejeitado',
}

@Entity('doacoes')
export class Doacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomeDoador: string;

  @Column({ nullable: true })
  cpfDoador: string; // opcional, LGPD

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ nullable: true })
  comprovantePixPath: string; // path do arquivo salvo no servidor

  @Column({ nullable: true })
  comprovantePixOriginalName: string;

  @Column({ nullable: true })
  mensagem: string;

  @Column({
    type: 'enum',
    enum: StatusDoacao,
    default: StatusDoacao.PENDENTE,
  })
  status: StatusDoacao;

  @Column({ nullable: true })
  conferidoPor: string; // nome do admin que conferiu

  @Column({ nullable: true })
  conferidoEm: Date;

  @CreateDateColumn()
  criadoEm: Date;
}
