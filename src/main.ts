import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen( process.env.PORT || 5000 );
 // await app.listen( process.env.PORT || 5000 , "192.168.1.40");

}

bootstrap();
