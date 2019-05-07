import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantNonValideComponent } from './etudiant-non-valide.component';

describe('EtudiantNonValideComponent', () => {
  let component: EtudiantNonValideComponent;
  let fixture: ComponentFixture<EtudiantNonValideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudiantNonValideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantNonValideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
