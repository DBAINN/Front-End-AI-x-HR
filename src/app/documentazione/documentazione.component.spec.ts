import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentazioneComponent } from './documentazione.component';

describe('DocumentazioneComponent', () => {
  let component: DocumentazioneComponent;
  let fixture: ComponentFixture<DocumentazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentazioneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
