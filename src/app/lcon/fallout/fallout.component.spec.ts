import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FalloutComponent } from './fallout.component';

describe('FalloutComponent', () => {
  let component: FalloutComponent;
  let fixture: ComponentFixture<FalloutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FalloutComponent]
    });
    fixture = TestBed.createComponent(FalloutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
