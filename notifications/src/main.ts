import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { microserviceConfig } from './kafka-config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(microserviceConfig);

  app.enableCors({
    origin: [process.env.WEB_DOMAIN],
  });
  
  app.setGlobalPrefix('notifications');

  await app.startAllMicroservices();

  await app.listen(process.env.PORT);
}

bootstrap().then(() =>
  Logger.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT}`,
  ),
);
