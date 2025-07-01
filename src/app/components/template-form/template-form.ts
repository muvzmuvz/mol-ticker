import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './template-form.html',
  styleUrl: './template-form.less'
})
export class TemplateFormComponent {
  name = '';
  imageFile: File | null = null;
  htmlFile: File | null = null;
  ean13 = ''; // Добавляем поле для EAN-13, если нужно

  constructor(private http: HttpClient) { }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imageFile = input.files[0];
    }
  }

  onHtmlSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.htmlFile = input.files[0];
    }
  }
  uploadTemplate() {
    if (!this.name || !this.imageFile || !this.htmlFile) {
      alert('Заполните все поля и выберите файлы');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Вы не авторизованы');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('image', this.imageFile);
    formData.append('html', this.htmlFile); 
    formData.append('ean13', this.ean13) // <-- "html", как ты указал

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.http.post('http://192.168.0.174:3000/templates/upload', formData, { headers }).subscribe({
      next: () => {
        alert('Шаблон успешно загружен!');
        window.location.reload();
      },
      error: (err) => {
        console.error('Ошибка загрузки:', err);
        alert('Произошла ошибка при загрузке');
      }
    });
  }
}
