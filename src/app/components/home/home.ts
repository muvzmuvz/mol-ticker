import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrinterComponent } from '../printer/printer';
import { CommonModule } from '@angular/common';
import { PrintCard } from '../print-card/print-card';
import { HeaderComponent } from '../header/header';
import { TemplateFormComponent } from '../template-form/template-form';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NgIf } from '@angular/common';
import { RoleService } from '../auth/role';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, FormsModule, HttpClientModule, CommonModule, PrintCard, HeaderComponent, TemplateFormComponent, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.less',
  standalone: true,
  providers: [AuthService, RoleService]  // Внедряем сервисы
})
export class Home {
  protected title = 'mmol-ticket';
  isOpen = false;
  cardsAreLoaded = false;
  userRole: string | null = null;

  constructor(
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private authService: RoleService  // Внедряем сервис
  ) {
    this.loadUserRole();
  }

  openForm() {
    this.isOpen = true;
  }

  closeForm() {
    this.isOpen = false;
  }

  onTemplatesLoaded(loaded: boolean) {
    this.ngZone.run(() => {
      this.cardsAreLoaded = loaded;
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
}