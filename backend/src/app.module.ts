import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TemplateModule } from './template/template.module';
import { Template } from './template/template.entity';
import { PrintController } from './print/print.controller';
import { PrintService } from './print/print.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../assets'),
      serveRoot: '/assets',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Template],
      synchronize: true,
    }),
    TemplateModule,
  ],
  controllers: [PrintController],
  providers: [PrintService],
})
export class AppModule {}
