import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanformComponent } from './scanform.component';

describe('ScanformComponent', () => {
  let component: ScanformComponent;
  let fixture: ComponentFixture<ScanformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScanformComponent]
    });
    fixture = TestBed.createComponent(ScanformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
