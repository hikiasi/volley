import html_to_pdf from 'html-pdf-node';
import type { Booking, Camp } from '@prisma/client';

function getReceiptHtml(booking: Booking & { camp: Camp }): string {
    const title = 'Квитанция об оплате';
    const bookingId = booking.id;
    const paymentDate = new Date(booking.updatedAt).toLocaleDateString('ru-RU');
    const campTitle = booking.camp.title;
    const campDates = `${new Date(booking.camp.startDate).toLocaleDateString('ru-RU')} - ${new Date(booking.camp.endDate).toLocaleDateString('ru-RU')}`;
    const amount = (booking.paidAmount / 100).toLocaleString('ru-RU');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <style>
                body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; }
                .container { width: 80%; margin: auto; padding: 30px; border: 1px solid #eee; }
                h1 { text-align: center; color: #000; }
                .details, .camp-info, .payment-details { margin-bottom: 20px; }
                .details p, .camp-info p, .payment-details p { margin: 5px 0; }
                .total { margin-top: 30px; text-align: right; font-size: 1.2em; font-weight: bold; }
                .footer { margin-top: 40px; text-align: center; font-size: 0.8em; color: #777; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px;}
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .text-right { text-align: right; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${title}</h1>
                <div class="details">
                    <p><strong>Номер заказа:</strong> ${bookingId}</p>
                    <p><strong>Дата платежа:</strong> ${paymentDate}</p>
                </div>
                <div class="camp-info">
                    <p><strong>Информация о кэмпе:</strong></p>
                    <p>Название: ${campTitle}</p>
                    <p>Даты: ${campDates}</p>
                </div>
                <div class="payment-details">
                    <p><strong>Детали платежа:</strong></p>
                    <table>
                        <thead>
                            <tr>
                                <th>Описание</th>
                                <th class="text-right">Кол-во</th>
                                <th class="text-right">Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${campTitle}</td>
                                <td class="text-right">1</td>
                                <td class="text-right">${amount} RUB</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="total">
                    <p>Итого оплачено: ${amount} RUB</p>
                </div>
                <div class="footer">
                    <p>Спасибо за участие!</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export async function generateReceiptPdf(booking: Booking & { camp: Camp }): Promise<Buffer> {
  const html = getReceiptHtml(booking);
  const options = { format: 'A4' };
  
  const fileBuffer = await html_to_pdf.generatePdf({ content: html }, options);
  return fileBuffer;
}
