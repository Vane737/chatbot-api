/* eslint-disable prettier/prettier */
import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as Handlebars from 'handlebars';
import * as pdf from 'html-pdf';

@Injectable()
export class PdfService {

  private blobServiceClient: BlobServiceClient;
  private containerName: string = 'pdfs'; // Nombre del contenedor que has creado

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  }


  async generatePdf(data: any): Promise<string> {
    const templateHtml = fs.readFileSync('./src/pdf/template.html', 'utf8'); // Ruta a tu plantilla HTML
    const template = Handlebars.compile(templateHtml);
    const html = template(data);

    // Opciones de formato para el PDF
    const options: pdf.CreateOptions = {
      format: 'A4' // Puedes ajustar el tamaño de la página según tus necesidades
    };

    return new Promise((resolve, reject) => {
      pdf.create(html, options).toBuffer(async (err, buffer) => {
        if (err) {
          return reject(err);
        }

        try {
          const pdfUrl = await this.uploadPdfToAzure(buffer);
          resolve(pdfUrl);
        } catch (uploadErr) {
          reject(uploadErr);
        }
      });
    });
  }

  private async uploadPdfToAzure(buffer: Buffer): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blobName = `${uuidv4()}.pdf`;  // Genera un nombre único para el archivo PDF
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(buffer, buffer.length); // Sube el archivo al contenedor en Azure Blob Storage
    return blockBlobClient.url; // Devuelve la URL pública del archivo subido
  }

}