import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FulldeckComponent } from './fulldeck.component';

describe('FulldeckComponent', () => {
  let component: FulldeckComponent;
  let fixture: ComponentFixture<FulldeckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulldeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FulldeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
