import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { microserviceConfig } from './kafka-config';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(microserviceConfig);

  app.enableCors({
    origin: [process.env.WEB_DOMAIN, 'http://localhost:4200'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['content-type'],
    credentials: true,
  });

  app.setGlobalPrefix('auth');

  await app.startAllMicroservices();


  app.use(cookieParser())


  await app.listen(process.env.PORT);
}

bootstrap().then(() =>
  Logger.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT}`,
  ),
);
