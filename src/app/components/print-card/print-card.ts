import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PrinterComponent } from '../printer/printer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-print-card',
  imports: [FormsModule, PrinterComponent, CommonModule],
  templateUrl: './print-card.html',
  styleUrl: './print-card.less'
})
export class PrintCard {
  product = {
    templateName: 'docktorskaya', // Название шаблона
    name: 'Доктораская колбаса',
    date: '',
    weight: 0,
  };

  isOpen = false; // Флаг для отслеживания состояния модального окна
  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}
