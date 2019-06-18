import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandAnalyzerComponent } from './hand-analyzer.component';

describe('HandAnalyzerComponent', () => {
  let component: HandAnalyzerComponent;
  let fixture: ComponentFixture<HandAnalyzerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandAnalyzerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
