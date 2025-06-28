// src/app/services/template.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Делает сервис доступным глобально
})
export class TemplateService {
  private apiUrl = 'http://localhost:3000/templates';

  constructor(private http: HttpClient) { }

  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
