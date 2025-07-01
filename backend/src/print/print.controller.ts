import { Controller, Post, Body, Res } from '@nestjs/common';
import { PrintService } from './print.service';
import { Response } from 'express';

@Controller('print')
export class PrintController {
  constructor(private svc: PrintService) {}

  @Post()
  async print(@Body() b: { data: any; templateName: string; copies: number,}, @Res() res: Response) {
    const buf = await this.svc.generatePdfBuffer(b.data, b.templateName);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=label.pdf',
    });
    res.send(buf);
  }
}
