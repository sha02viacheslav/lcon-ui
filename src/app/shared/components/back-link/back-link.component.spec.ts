import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackLinkComponent } from './back-link.component';

describe('BackLinkComponent', () => {
  let component: BackLinkComponent;
  let fixture: ComponentFixture<BackLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackLinkComponent]
    });
    fixture = TestBed.createComponent(BackLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
