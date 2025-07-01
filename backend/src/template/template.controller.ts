import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from './template.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
// 🔐 Защита по ролям
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { }

  // 👁 Получить список всех шаблонов (доступно всем)
  @Get()
  getAll(): Promise<Template[]> {
    return this.templateService.findAll();
  }

  // 🔐 Создание шаблона (только для админа)
  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() data: Partial<Template>): Promise<Template> {
    if (data.ean13 && !/^\d{13}$/.test(data.ean13)) {
      throw new BadRequestException('ean13 должен содержать 13 цифр');
    }
    return this.templateService.create(data);
  }

  // 🔐 Загрузка файлов (HTML и изображение) + EAN-13
  @Post('upload')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'html', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './assets',
          filename: (req, file, cb) => {
            const filename = path.basename(file.originalname);
            cb(null, filename);
          },
        }),
      },
    ),
  )
  async uploadFiles(
    @UploadedFiles()
    files: {
      html?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
    @Body('name') name: string,
    @Body('ean13') ean13: string,
  ): Promise<Template> {
    if (!files.html || !files.image) {
      throw new BadRequestException('Оба файла (html и image) обязательны.');
    }

    if (ean13 && !/^\d{13}$/.test(ean13)) {
      throw new BadRequestException('ean13 должен содержать 13 цифр');
    }

    const htmlFile = files.html[0];
    const imageFile = files.image[0];
    const templateName = path.parse(htmlFile.originalname).name;

    const newTemplate: Partial<Template> = {
      name,
      templateName,
      image: imageFile.originalname,
      ean13,
    };

    return this.templateService.create(newTemplate);
  }

  // 🔐 Редактирование шаблона
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'html', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './assets',
          filename: (req, file, cb) => {
            const filename = path.basename(file.originalname);
            cb(null, filename);
          },
        }),
      },
    ),
  )
  async editTemplate(
    @Param('id') id: string,
    @UploadedFiles() files: {
      html?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
    @Body('name') name: string,
    @Body('ean13') ean13: string,
  ): Promise<Template> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Некорректный ID');
    }

    const existing = await this.templateService.findById(parsedId);
    if (!existing) {
      throw new NotFoundException(`Шаблон с ID ${parsedId} не найден`);
    }

    const updateData: Partial<Template> = {};
    if (name) updateData.name = name;
    if (files.html?.[0]) {
      updateData.templateName = path.parse(files.html[0].originalname).name;
    }
    if (files.image?.[0]) {
      updateData.image = files.image[0].originalname;
    }
    if (ean13) {
      if (!/^\d{13}$/.test(ean13)) {
        throw new BadRequestException('ean13 должен содержать 13 цифр');
      }
      updateData.ean13 = ean13;
    }

    return this.templateService.update(parsedId, updateData);
  }

  // 🔐 Удаление шаблона
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Некорректный ID');
    }

    const existing = await this.templateService.findById(parsedId);
    if (!existing) {
      throw new NotFoundException(`Шаблон с ID ${parsedId} не найден`);
    }

    await this.templateService.remove(parsedId);
    return { message: `Шаблон с ID ${parsedId} удалён` };
  }

  @Get('files')
  getAvailableHtmlFiles(): string[] {
    const dir = './assets';
    const files = fs.readdirSync(dir);
    return files.filter(file => file.endsWith('.html'));
  }
}
