import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantEnCoursComponent } from './etudiant-en-cours.component';

describe('EtudiantEnCoursComponent', () => {
  let component: EtudiantEnCoursComponent;
  let fixture: ComponentFixture<EtudiantEnCoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudiantEnCoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantEnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
