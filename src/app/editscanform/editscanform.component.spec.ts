import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditscanformComponent } from './editscanform.component';

describe('EditscanformComponent', () => {
  let component: EditscanformComponent;
  let fixture: ComponentFixture<EditscanformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditscanformComponent]
    });
    fixture = TestBed.createComponent(EditscanformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
