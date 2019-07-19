import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RazzComponent } from './razz.component';

describe('RazzComponent', () => {
  let component: RazzComponent;
  let fixture: ComponentFixture<RazzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RazzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
