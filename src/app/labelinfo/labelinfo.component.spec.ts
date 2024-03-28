import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelinfoComponent } from './labelinfo.component';

describe('LabelinfoComponent', () => {
  let component: LabelinfoComponent;
  let fixture: ComponentFixture<LabelinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelinfoComponent]
    });
    fixture = TestBed.createComponent(LabelinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
