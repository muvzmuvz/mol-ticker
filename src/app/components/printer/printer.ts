import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.html',
  styleUrls: ['./printer.less'],
  imports: [FormsModule, CommonModule],
})
export class PrinterComponent implements OnInit {
  @Input() templateName = '';
  @Input() name = '';

  product = { name: '', date: '', weight: 0.450 };
  copies = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.product.name = this.name;
  }

  print() {
    const body = {
      templateName: this.templateName,
      copies: this.copies,
      data: {
        name: this.product.name,
        date: this.product.date,
        weight: this.product.weight.toFixed(3),
      },
    };
    this.http.post('http://192.168.0.174:3000/print', body, { responseType: 'blob' })
      .subscribe(blob => {
        const url = URL.createObjectURL(blob);
        const w = window.open(url);
        w?.addEventListener('load', () => w.print());
      });
  }
}
