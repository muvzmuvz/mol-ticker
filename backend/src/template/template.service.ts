// src/template/template.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private repo: Repository<Template>,
  ) {}

  findAll(): Promise<Template[]> {
    return this.repo.find();
  }

  create(data: Partial<Template>): Promise<Template> {
    return this.repo.save(data);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
