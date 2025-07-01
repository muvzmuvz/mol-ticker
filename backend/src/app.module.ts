import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TemplateModule } from './template/template.module';
import { Template } from './template/template.entity';
import { PrintController } from './print/print.controller';
import { PrintService } from './print/print.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';   
import { PrintModule } from './print/print.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../assets'),
      serveRoot: '/assets',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Template, User],
      synchronize: true,
    }),
    TemplateModule,
    AuthModule,
    PrintModule
  ],

})
export class AppModule {}
