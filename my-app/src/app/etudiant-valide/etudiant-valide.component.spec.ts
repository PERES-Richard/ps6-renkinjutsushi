import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantValideComponent } from './etudiant-valide.component';

describe('EtudiantValideComponent', () => {
  let component: EtudiantValideComponent;
  let fixture: ComponentFixture<EtudiantValideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudiantValideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantValideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
