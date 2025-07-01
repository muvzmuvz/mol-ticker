import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as bwipjs from 'bwip-js';
import { Template } from 'src/template/template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PrintService {
  constructor(
    @InjectRepository(Template)
    private templateRepo: Repository<Template>,
  ) {}

  private async generateBarcodeBase64(ean13: string): Promise<string> {
    try {
      const png = await bwipjs.toBuffer({
        bcid: 'ean13',
        text: ean13,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });
      return `data:image/png;base64,${png.toString('base64')}`;
    } catch (err) {
      console.error('Ошибка генерации штрих-кода:', err);
      throw err;
    }
  }

  async generatePdfBuffer(
    data: any,
    templateName?: string,
    templateId?: number,
  ): Promise<Buffer> {
    let template: Template | null = null;

    if (templateId !== undefined) {
      template = await this.templateRepo.findOneBy({ id: templateId });
    } else if (templateName) {
      template = await this.templateRepo.findOneBy({ templateName });
    }

    if (!template) {
      throw new Error('Шаблон не найден по id или имени');
    }

    const templatePath = path.join(__dirname, `../../assets/${template.templateName}.html`);

    let html = fs.readFileSync(templatePath, 'utf8')
      .replace('<head>', `<head><base href="http://localhost:3000/">`)
      .replace(/{{name}}/g, data.name || '')
      .replace(/{{date}}/g, data.date || '')
      .replace(/{{weight}}/g, data.weight || '');

    let ean13 = data.ean13 || template.ean13;

    let barcode = '';
    if (ean13 && /^\d{13}$/.test(ean13)) {
      barcode = await this.generateBarcodeBase64(ean13);
    } else {
      console.warn('ean13 отсутствует или некорректен');
    }

    html = html.replace(/{{barcode}}/g, barcode);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 189 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      width: '98mm',
      height: '80mm',
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdf);
  }
}
