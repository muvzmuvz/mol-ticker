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
async update(id: number, data: Partial<Template>): Promise<Template> {
  await this.repo.update(id, data); // обновим запись
  const updated = await this.repo.findOneBy({ id }); // вернём обновлённый шаблон
  if (!updated) {
    throw new Error(`Template with id ${id} not found`);
  }
  return updated;
}
async findById(id: number): Promise<Template | null> {
  return this.repo.findOneBy({ id });
}

}
