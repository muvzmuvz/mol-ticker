import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { AuthModule } from '../auth/auth.module'; // Импорт модуля аутентификации

@Module({
    imports: [TypeOrmModule.forFeature([Template]),  AuthModule],
    providers: [TemplateService],
    controllers: [TemplateController],
})
export class TemplateModule { }
