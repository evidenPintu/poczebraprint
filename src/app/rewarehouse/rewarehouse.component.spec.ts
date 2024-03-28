import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewarehouseComponent } from './rewarehouse.component';

describe('RewarehouseComponent', () => {
  let component: RewarehouseComponent;
  let fixture: ComponentFixture<RewarehouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RewarehouseComponent]
    });
    fixture = TestBed.createComponent(RewarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
