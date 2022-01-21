import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtesyDialogComponent } from './courtesy-dialog.component';

describe('CourtesyDialogComponent', () => {
  let component: CourtesyDialogComponent;
  let fixture: ComponentFixture<CourtesyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourtesyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtesyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
