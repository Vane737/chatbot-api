/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(@Body() data: any, @Res() res: Response): Promise<void> {
    const pdfUrl = await this.pdfService.generatePdf(data);
    res.json({ url: pdfUrl });
  }
}