import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PrintService {
  async generatePdfBuffer(data: any, templateName: string, copies: number): Promise<Buffer> {
    const templatePath = path.join(__dirname, `../../assets/${templateName}.html`);
    const html = fs.readFileSync(templatePath, 'utf8')
      .replace('<head>', `<head><base href="http://localhost:3000/">`)
      .replace(/{{name}}/g, data.name)
      .replace(/{{date}}/g, data.date)
      .replace(/{{weight}}/g, data.weight);

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
