import {
  Controller,
  Get,
  Post,
  Body,
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
