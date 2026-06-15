import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunosModule } from './modules/alunos/alunos.module';
import { MatriculasModule } from './modules/matriculas/matriculas.module';
import { PresencaModule } from './modules/presenca/presenca.module';
import { DoacoesModule } from './modules/doacoes/doacoes.module';
import { RelatoriosModule } from './modules/relatorios/relatorios.module';
import { TurmasModule } from './modules/turmas/turmas.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Carrega .env automaticamente
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexão com PostgreSQL via variáveis de ambiente
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') === 'development', // só em dev!
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Módulos de negócio
    AuthModule,
    AlunosModule,
    MatriculasModule,
    PresencaModule,
    DoacoesModule,
    RelatoriosModule,
    TurmasModule,
  ],
})
export class AppModule {}
