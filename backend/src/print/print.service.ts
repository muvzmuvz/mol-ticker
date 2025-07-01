import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as bwipjs from 'bwip-js'; // 📦 генератор штрих-кодов
import { Template } from 'src/template/template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PrintService {
  constructor(
    @InjectRepository(Template)
    private templateRepo: Repository<Template>,
  ) { }

  // Функция генерации изображения штрих-кода в base64
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

  async generatePdfBuffer(data: any, templateName: string): Promise<Buffer> {
    const templatePath = path.join(__dirname, `../../assets/${templateName}.html`);

    // Загружаем HTML-шаблон
    let html = fs.readFileSync(templatePath, 'utf8')
      .replace('<head>', `<head><base href="http://localhost:3000/">`)
      .replace(/{{name}}/g, data.name || '')
      .replace(/{{date}}/g, data.date || '')
      .replace(/{{weight}}/g, data.weight || '');

    // Получаем ean13: сначала из запроса, потом из шаблона в базе
    let ean13 = data.ean13;

    if (!ean13) {
      const template = await this.templateRepo.findOneBy({ templateName });
      if (template?.ean13) {
        ean13 = template.ean13;
        console.log(`ean13 найден в БД: ${ean13}`);
      } else {
        console.warn('ean13 не найден ни в запросе, ни в базе');
      }
    }

    // Проверка и генерация штрих-кода
    let barcode = '';

    if (ean13 && /^\d{13}$/.test(ean13)) {
      barcode = await this.generateBarcodeBase64(ean13);
    } else {
      console.warn('ean13 отсутствует или некорректен');
      console.log('Данные запроса:', data);
    }
    console.log('Проверка: есть ли barcode в HTML?', barcode.slice(0, 30)); // покажет начало строки
    console.log('HTML с barcode:', html.includes(barcode)); // true / false
    // Вставка изображения штрихкода в шаблон
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
