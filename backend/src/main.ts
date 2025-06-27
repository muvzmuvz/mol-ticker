import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // нужно для доступа из Angular
  await app.listen(3000);
}
bootstrap();
