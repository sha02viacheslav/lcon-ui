import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LconComponent } from './lcon.component';

describe('LconComponent', () => {
  let component: LconComponent;
  let fixture: ComponentFixture<LconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LconComponent]
    });
    fixture = TestBed.createComponent(LconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
