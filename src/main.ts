import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './app.config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  let globalPrefix = 'api';
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  app.useGlobalPipes(new ValidationPipe());
  let options: SwaggerDocumentOptions =  {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  }
  let swaggerConfig = new DocumentBuilder()
    .setTitle('Invoice Management System')
    .setDescription('API documentation for Invoice Managment System for TheMultiple')
    .setVersion('1.0.0')
    .build();
  let document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup('docs', app, document);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [AppConfig().RABBITMQ_URL],
      queue: 'notifications',
      queueOptions: { durable: false },
    }
  });
  await app.startAllMicroservices();
  await app.listen(AppConfig().PORT, () => console.log('====== Server Running ======'));
}
bootstrap();
