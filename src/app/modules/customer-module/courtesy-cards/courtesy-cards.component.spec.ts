import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtesyCardsComponent } from './courtesy-cards.component';

describe('CourtesyCardsComponent', () => {
  let component: CourtesyCardsComponent;
  let fixture: ComponentFixture<CourtesyCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourtesyCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtesyCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
