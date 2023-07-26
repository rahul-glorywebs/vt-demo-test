import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeFrameComponent } from './resize-frame.component';

describe('ResizeFrameComponent', () => {
  let component: ResizeFrameComponent;
  let fixture: ComponentFixture<ResizeFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizeFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizeFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
