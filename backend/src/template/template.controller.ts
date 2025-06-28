// src/template/template.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from './template.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  getAll(): Promise<Template[]> {
    return this.templateService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Template>): Promise<Template> {
    return this.templateService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Некорректный ID');
    }

    await this.templateService.remove(parsedId);

    return { message: `Шаблон с ID ${parsedId} удалён` };
  }

  @Post('upload')
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
  ): Promise<Template> {
    if (!files.html || !files.image) {
      throw new BadRequestException('Оба файла (html и image) обязательны.');
    }

    const htmlFile = files.html[0];
    const imageFile = files.image[0];

    const templateName = path.parse(htmlFile.originalname).name;

    const newTemplate = {
      name,
      templateName,
      image: imageFile.originalname,
    };

    return this.templateService.create(newTemplate);
  }
}
