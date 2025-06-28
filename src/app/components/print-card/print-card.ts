import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrinterComponent } from '../printer/printer';
import { ChangeDetectorRef } from '@angular/core';
import { RoleService } from '../auth/role';
import { NgZone } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

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
  userRole: string | null = null;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private authService: RoleService, private ngZone: NgZone) {
    this.loadUserRole();
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/templates')
      .subscribe(data => {
        console.log('templates:', data);
        this.templates = data;
        this.cd.detectChanges();
      });
  }
  loadUserRole() {
    this.authService.getUserRole().subscribe(role => {
      this.ngZone.run(() => {
        this.userRole = role;
        this.cd.detectChanges();  // Обновляем шаблон
      });
    });
  }

  openModal(template: any) {
    this.selectedProduct = template; // Просто сохраняем весь объект
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
  deleteTemplate(id: number) {
    if (!confirm('Удалить шаблон?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Вы не авторизованы');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.delete(`http://localhost:3000/templates/${id}`, { headers })
      .subscribe(() => {
        window.location.reload();  // Перезагрузка всей страницы
      }, error => {
        console.error('Ошибка при удалении:', error);
        alert('Не удалось удалить шаблон');
      });
  }


}