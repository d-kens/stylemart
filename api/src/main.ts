import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
    }
  ));

  

  const config = new DocumentBuilder()
    .setTitle('Stylemart API')
    .setDescription('The Stylemart API allows users to interact with an online fashion store, offering features like browsing products, managing orders, and user authentication.')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().then(() => {
  Logger.log(`🚀 Application is running on: http://localhost:${process.env.PORT}`)
});