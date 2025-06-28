import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PrintService {
  async generatePdfBuffer(data: any, templateName: string, copies: number): Promise<Buffer> {
    const templatePath = path.join(__dirname, `../../assets/${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf8');

    // Добавляем базовый URL для корректной загрузки ресурсов (картинок)
    html = html.replace('<head>', `<head><base href="http://localhost:3000/">`);

    // Подставляем данные в шаблон
    html = html.replace(/{{name}}/g, data.name)
               .replace(/{{date}}/g, data.date)
               .replace(/{{weight}}/g, data.weight);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Размер окна для генерации PDF (настрой по своему шаблону)
    await page.setViewport({ width: 375, height: 189 });

    // Загружаем HTML с ожиданием полной загрузки ресурсов
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Генерируем PDF с нужными размерами и без полей
    const pdfBuffer = await page.pdf({
      width: '98mm',
      height: '80mm',
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
