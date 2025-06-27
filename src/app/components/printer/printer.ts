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
    name: '',
    date: '',
    weight: 0,
  };
  copies = 1;

  constructor(private http: HttpClient) { }

  print() {
    const data = {
      name: this.product.name,
      date: this.product.date,
      weight: this.product.weight.toFixed(3), // ← сохраняем 3 знака после запятой в строку
    };

    this.http.post('http://localhost:3000/print', { data, copies: this.copies }, { responseType: 'blob' })
      .subscribe((pdfBlob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(blobUrl);
        if (printWindow) {
          printWindow.addEventListener('load', () => {
            printWindow.print();
          });
        }
      });
  }
}
