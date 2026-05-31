import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  // Validação automática dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Remove campos não declarados no DTO
      forbidNonWhitelisted: true,
      transform: true,        // Converte tipos automaticamente
    }),
  );

  // CORS para o frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  });

  // Swagger — documentação automática da API
  const config = new DocumentBuilder()
    .setTitle('SOAR API')
    .setDescription('Sistema de Gerenciamento — Instituto Carrascal')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🎸 SOAR API rodando em http://localhost:${port}`);
  console.log(`📚 Documentação em http://localhost:${port}/api/docs`);
}

bootstrap();
