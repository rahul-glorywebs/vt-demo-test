import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalSmartAppsComponent } from './clinical-smart-apps.component';

describe('ClinicalSmartAppsComponent', () => {
  let component: ClinicalSmartAppsComponent;
  let fixture: ComponentFixture<ClinicalSmartAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalSmartAppsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalSmartAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
