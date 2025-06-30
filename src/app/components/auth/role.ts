import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Внедряем платформу
  ) {}

  getUserRole(): Observable<string> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http
        .get<{ role: string }>('http://192.168.0.174:3000/auth/role', {
          headers,
        })
        .pipe(map(res => res.role));
    } else {
      // Возвращаем безопасное значение на сервере
      return of('guest');
    }
  }
}
