import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrinterComponent } from '../printer/printer';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-print-card',
  standalone: true,
  imports: [FormsModule, CommonModule, PrinterComponent,],
  templateUrl: './print-card.html',
  styleUrl: './print-card.less',
})
export class PrintCard {
  templates: any[] = [];          // Все шаблоны из базы
  selectedProduct: any = null;    // Текущий шаблон, выбранный для печати
  isOpen = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }




  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/templates')
      .subscribe(data => {
        console.log('templates:', data);
        this.templates = data;
        this.cd.detectChanges();
      });
  }


  openModal(template: any) {
    this.selectedProduct = template; // Просто сохраняем весь объект
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}