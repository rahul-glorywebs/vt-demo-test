import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdsHookComponent } from './cds-hook.component';

describe('CdsHookComponent', () => {
  let component: CdsHookComponent;
  let fixture: ComponentFixture<CdsHookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdsHookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdsHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
