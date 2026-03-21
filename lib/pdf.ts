import PDFDocument from 'pdfkit';
import type { Booking, Camp } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export function generateReceiptPdf(booking: Booking & { camp: Camp }): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- Font Registration ---
      // This is the most robust solution: read the font file directly from the filesystem.
      // This requires the user to place the font file in the specified path.
      const fontPath = path.join(process.cwd(), 'public', 'fonts', 'OpenSans-Regular.ttf');
      if (!fs.existsSync(fontPath)) {
        throw new Error(`Font file not found at ${fontPath}. Please download it and place it there.`);
      }
      doc.registerFont('OpenSans', fontPath);


      // --- PDF Content ---
      doc.font('OpenSans');

      doc.fontSize(20).text('Квитанция об оплате', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Номер заказа: ${booking.id}`);
      doc.text(`Дата платежа: ${new Date(booking.updatedAt).toLocaleDateString('ru-RU')}`);
      doc.moveDown();

      doc.fontSize(14).text('Информация о кэмпе:', { underline: true });
      doc.fontSize(12).text(`Название: ${booking.camp.title}`);
      doc.text(`Даты: ${new Date(booking.camp.startDate).toLocaleDateString('ru-RU')} - ${new Date(booking.camp.endDate).toLocaleDateString('ru-RU')}`);
      doc.moveDown();
      
      doc.fontSize(14).text('Детали платежа:', { underline: true });
      const tableTop = doc.y;
      const itemX = 50;
      const quantityX = 350;
      const priceX = 450;

      doc.fontSize(12).text('Описание', itemX, tableTop);
      doc.text('Кол-во', quantityX, tableTop, { width: 50, align: 'right' });
      doc.text('Сумма', priceX, tableTop, { width: 50, align: 'right' });
      
      doc.moveTo(itemX, tableTop + 15).lineTo(priceX + 50, tableTop + 15).strokeColor("#aaaaaa").stroke();

      const y = tableTop + 25;
      doc.text(booking.camp.title, itemX, y);
      doc.text('1', quantityX, y, { width: 50, align: 'right' });
      doc.text(`${(booking.paidAmount / 100).toLocaleString('ru-RU')} RUB`, priceX, y, { width: 50, align: 'right' });

      doc.moveDown(2);
      const totalY = doc.y;
      doc.fontSize(14).text('Итого оплачено:', itemX, totalY);
      doc.text(`${(booking.paidAmount / 100).toLocaleString('ru-RU')} RUB`, 0, totalY, { align: 'right' });

      doc.fontSize(10).text('Спасибо за участие!', 50, 750, { align: 'center', width: 500 });
      
      doc.end();
    } catch(err) {
      reject(err);
    }
  });
}
