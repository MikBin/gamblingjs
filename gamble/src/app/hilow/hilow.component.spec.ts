import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HilowComponent } from './hilow.component';

describe('HilowComponent', () => {
  let component: HilowComponent;
  let fixture: ComponentFixture<HilowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HilowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HilowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
