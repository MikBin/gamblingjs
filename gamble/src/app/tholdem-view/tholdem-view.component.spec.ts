import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TholdemViewComponent } from './tholdem-view.component';

describe('TholdemViewComponent', () => {
  let component: TholdemViewComponent;
  let fixture: ComponentFixture<TholdemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TholdemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TholdemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
