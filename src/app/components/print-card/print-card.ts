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
  templates: any[] = [];
  selectedProduct: any = null;
  isOpen = false;
  editMode = false;
  editName = '';
  editEan13 =''
  editHtml: File | null = null;
  selectedHtmlName: string = ''; // выбранный шаблон из списка
  availableHtmlFiles: string[] = []; // все доступные html-шаблоны
  editImage: File | null = null;
  userRole: string | null = null;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private authService: RoleService,
    private ngZone: NgZone
  ) {
    this.loadUserRole();
  }

  ngOnInit() {
    this.http.get<any[]>('http://192.168.0.174:3000/templates').subscribe(data => {
      this.templates = data;
      this.cd.detectChanges();
    });

    this.http.get<string[]>('http://192.168.0.174:3000/templates/files').subscribe(files => {
      this.availableHtmlFiles = files;
    });
  }

  loadUserRole() {
    this.authService.getUserRole().subscribe(role => {
      this.ngZone.run(() => {
        this.userRole = role;
        this.cd.detectChanges();
      });
    });
  }

  openModal(template: any) {
    this.selectedProduct = template;
    this.isOpen = true;
    this.editMode = false;
    this.editName = template.name;
    this.editEan13 = template.ean13;
    this.selectedHtmlName = template.templateName + '.html'; // подставляем текущий
  }

  closeModal() {
    this.isOpen = false;
    this.editMode = false;
    this.editHtml = null;
    this.editImage = null;
    this.selectedHtmlName = '';
  }

  enableEdit() {
    this.editMode = true;
    this.editName = this.selectedProduct.name;
  }

  onFileChange(type: 'html' | 'image', event: any) {
    const file = event.target.files[0];
    if (type === 'html') this.editHtml = file;
    if (type === 'image') this.editImage = file;
  }

  saveChanges() {
    if (!this.selectedProduct) return;

    const formData = new FormData();
    formData.append('name', this.editName);
    formData.append('ean13',this.editEan13 );

    if (this.editHtml) {
      formData.append('html', this.editHtml); // Приоритет загрузке
    } else if (this.selectedHtmlName) {
      formData.append('templateName', this.selectedHtmlName.replace('.html', ''));
    }

    if (this.editImage) {
      formData.append('image', this.editImage);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Вы не авторизованы');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .patch(`http://192.168.0.174:3000/templates/${this.selectedProduct.id}`, formData, { headers })
      .subscribe(
        () => {
          alert('Шаблон обновлён!');
          window.location.reload();
        },
        error => {
          console.error('Ошибка при обновлении:', error);
          alert('Ошибка при обновлении');
        }
      );
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

    this.http.delete(`http://192.168.0.174:3000/templates/${id}`, { headers }).subscribe(
      () => {
        window.location.reload();
      },
      error => {
        console.error('Ошибка при удалении:', error);
        alert('Не удалось удалить шаблон');
      }
    );
  }
}