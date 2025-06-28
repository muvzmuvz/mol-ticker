import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCard } from './print-card';

describe('PrintCard', () => {
  let component: PrintCard;
  let fixture: ComponentFixture<PrintCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
