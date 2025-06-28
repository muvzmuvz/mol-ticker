import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrinterComponent } from './components/printer/printer';
import { CommonModule } from '@angular/common';
import { PrintCard } from './components/print-card/print-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, HttpClientModule, PrinterComponent, CommonModule, PrintCard],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  protected title = 'mmol-ticket';
}
