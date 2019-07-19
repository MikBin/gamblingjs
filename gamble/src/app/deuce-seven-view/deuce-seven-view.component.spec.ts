import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeuceSevenViewComponent } from './deuce-seven-view.component';

describe('DeuceSevenViewComponent', () => {
  let component: DeuceSevenViewComponent;
  let fixture: ComponentFixture<DeuceSevenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeuceSevenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeuceSevenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
