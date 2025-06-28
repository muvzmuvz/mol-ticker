import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-auth',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './auth.html',
  styleUrl: './auth.less'
})
export class Auth {


  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService) { }

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.access_token);
        window.location.href = '/';  // Перенаправляем на главную
      },
      error: () => {
        this.errorMessage = 'Неверный логин или пароль';
      },
    });
  }
}

