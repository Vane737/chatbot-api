/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as pdf from 'html-pdf';

@Injectable()
export class PdfService {
  async generatePdf(data: any): Promise<string> {
    const templateHtml = fs.readFileSync('./src/pdf/template.html', 'utf8');
    const template = Handlebars.compile(templateHtml);
    const html = template(data);

    //const options = { format: 'A4' };

    /*return new Promise((resolve, reject) => {
      pdf.create(html, options as pdf.CreateOptions).toBuffer((err, buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(buffer);
      });
    });*/

    return new Promise((resolve, reject) => {
      pdf.create(html, { format: "A4" }).toFile('src/generated/confirmacion_cita22.pdf', (err, res) => {
        if (err) {
          return reject(err);
        }
        console.log('El pdf se ha generado con exito');
        resolve(res.filename); // Devuelve la ruta del archivo guardado
      });
    });

  }
}