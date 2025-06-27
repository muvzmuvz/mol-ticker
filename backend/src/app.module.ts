import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrintController } from './print/print.controller';
import { PrintService } from './print/print.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../assets'),  // путь к папке с картинками и шаблонами
      serveRoot: '/assets',                       // URL, по которому будут доступны файлы
    }),
  ],
  controllers: [PrintController],
  providers: [PrintService],
})
export class AppModule { }
