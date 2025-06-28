import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrinterComponent } from '../printer/printer';

@Component({
  selector: 'app-print-card',
  standalone: true,
  imports: [FormsModule, CommonModule, PrinterComponent, ],
  templateUrl: './print-card.html',
  styleUrl: './print-card.less',
})
export class PrintCard {
  templates: any[] = [];          // Все шаблоны из базы
  selectedProduct: any = null;    // Текущий шаблон, выбранный для печати
  isOpen = false;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/templates')
      .subscribe(data => {
        this.templates = data;
      });
  }

  openModal(template: any) {
    this.selectedProduct = {
      templateName: template.templateName,
      name: template.name,
      date: '',
      weight: 0,
    };
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}
