import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleSearchComponent } from './multiple-search.component';

describe('MultipleSearchComponent', () => {
  let component: MultipleSearchComponent;
  let fixture: ComponentFixture<MultipleSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultipleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
