import { Controller, Get, Post, Body } from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from './template.entity';

@Controller('templates')
export class TemplateController {
    constructor(private svc: TemplateService) { }

    @Get()
    getAll(): Promise<Template[]> {
        return this.svc.findAll();
    }

    @Post()
    create(@Body() data: Partial<Template>): Promise<Template> {
        return this.svc.create(data);
    }
}
