import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Allow requests from all origins (Vercel + Localhost)
  app.enableCors({ origin: '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Swagger Documentation for SIH Evaluators
  const config = new DocumentBuilder()
    .setTitle('MHA - AI Fake Identity & Document Screening API')
    .setDescription('Sashastra Seema Bal (SSB) Border Checkpoint Screening System')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // BIND EXPLICITLY TO 0.0.0.0 AND process.env.PORT FOR RENDER
  const port = Number(process.env.PORT) || 10000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 SSB Border Screening API live on: http://0.0.0.0:${port}/api`);
  Logger.log(`📑 Swagger Docs: http://0.0.0.0:${port}/api/docs`);
}

bootstrap();