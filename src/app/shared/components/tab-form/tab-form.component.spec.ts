import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFormComponent } from './tab-form.component';

describe('TabFormComponent', () => {
  let component: TabFormComponent;
  let fixture: ComponentFixture<TabFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
