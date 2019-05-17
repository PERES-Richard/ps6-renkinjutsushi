import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavPopupComponent } from './fav-popup.component';

describe('FavPopupComponent', () => {
  let component: FavPopupComponent;
  let fixture: ComponentFixture<FavPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
