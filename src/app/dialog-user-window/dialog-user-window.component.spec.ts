import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserWindowComponent } from './dialog-user-window.component';

describe('DialogUserWindowComponent', () => {
  let component: DialogUserWindowComponent;
  let fixture: ComponentFixture<DialogUserWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUserWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogUserWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
