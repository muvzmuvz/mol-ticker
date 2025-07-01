import { Controller, Post, Body, Res, BadRequestException } from '@nestjs/common';
import { PrintService } from './print.service';
import { Response } from 'express';

@Controller('print')
export class PrintController {
  constructor(private svc: PrintService) { }

  @Post()
  async print(
    @Body() b: { data: any; templateId?: string; templateName?: string; copies?: number },
    @Res() res: Response,
  ) {
    let templateIdNum: number | undefined = undefined;

    // Если передали templateId, преобразуем в число и проверяем
    if (b.templateId) {
      templateIdNum = parseInt(b.templateId, 10);
      if (isNaN(templateIdNum)) {
        throw new BadRequestException('templateId должен быть числом');
      }
    }

    const buf = await this.svc.generatePdfBuffer(b.data, b.templateName, templateIdNum);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=label.pdf',
    });
    res.send(buf);
  }
}
