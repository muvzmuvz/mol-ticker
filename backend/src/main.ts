import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const usersService = app.get(UsersService);

  const adminExists = await usersService.findByUsername('admin');

  if (adminExists) {
    await usersService.delete(adminExists.id); // Удаляем старого админа
  }

  await usersService.create('admin', 'admin123', 'admin'); // Создаем нового админа
  console.log('✅ Админ создан: admin / admin123');

  await app.listen(3000);
}
bootstrap();
