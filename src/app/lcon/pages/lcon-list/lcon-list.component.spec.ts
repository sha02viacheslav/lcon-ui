import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LconListComponent } from './lcon-list.component';

describe('LconListComponent', () => {
  let component: LconListComponent;
  let fixture: ComponentFixture<LconListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LconListComponent],
    });
    fixture = TestBed.createComponent(LconListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
