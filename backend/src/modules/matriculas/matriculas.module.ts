import { Module } from '@nestjs/common';

// Este módulo expande o AlunosModule com lógicas específicas de matrícula
// como confirmação por e-mail, impressão de ficha, etc.
// Por ora, redireciona para o fluxo em AlunosModule.
@Module({})
export class MatriculasModule {}
