import { Controller, Post, Body, Res } from '@nestjs/common';
import { PrintService } from './print.service';
import { Response } from 'express';

@Controller('print')
export class PrintController {
  constructor(private readonly printService: PrintService) {}

  @Post()
  async print(@Body() body: { data: any; copies: number }, @Res() res: Response) {
    const pdfBuffer = await this.printService.generatePdfBuffer(body.data);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=label.pdf',
    });
    res.send(pdfBuffer);
  }
}