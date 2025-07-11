import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrinterComponent } from './components/printer/printer';
import { CommonModule } from '@angular/common';
import { PrintCard } from './components/print-card/print-card';
import { HeaderComponent } from './components/header/header';
import { TemplateFormComponent } from './components/template-form/template-form';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { AuthService } from './components/auth/auth.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.less'],
  imports: [RouterOutlet, FormsModule, HttpClientModule, CommonModule, PrintCard, HeaderComponent, TemplateFormComponent, NgIf],
  providers: [AuthService],
  standalone: true
})
export class App {
  protected title = 'mmol-ticket';
  isOpen = false;
  cardsAreLoaded = false;

  constructor(private cd: ChangeDetectorRef, private ngZone: NgZone) { } // Внедряем ChangeDetectorRef и NgZone

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
}
