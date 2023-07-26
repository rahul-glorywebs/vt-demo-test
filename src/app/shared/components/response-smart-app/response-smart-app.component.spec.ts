import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseSmartAppComponent } from './response-smart-app.component';

describe('ResponseSmartAppComponent', () => {
  let component: ResponseSmartAppComponent;
  let fixture: ComponentFixture<ResponseSmartAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseSmartAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseSmartAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
