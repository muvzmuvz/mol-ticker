import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.html',
  styleUrl: './printer.less',
  imports: [FormsModule]
})
export class PrinterComponent {
  product = {
    templateName: 'kolbasa', // Название шаблона
    name: '',
    date: '',
    weight: 0,
  };

  copies = 1; // Количество копий

  constructor(private http: HttpClient) { }

  print() {
    // Формируем тело запроса правильно
    const requestBody = {
      templateName: this.product.templateName,
      copies: this.copies,
      data: {
        name: this.product.name,
        date: this.product.date,
        weight: this.product.weight.toFixed(3), // сохраняем 3 знака после запятой
      }
    };

    // Отправляем POST-запрос на сервер
    this.http.post('http://localhost:3000/print', requestBody, { responseType: 'blob' })
      .subscribe((pdfBlob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(blobUrl);

        if (printWindow) {
          printWindow.addEventListener('load', () => {
            printWindow.print();
          });
        } else {
          alert('Не удалось открыть окно для печати');
        }
      }, (error) => {
        console.error('Ошибка при печати:', error);
        alert('Ошибка при отправке запроса на печать');
      });
  }
}
