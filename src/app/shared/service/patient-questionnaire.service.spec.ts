import { TestBed } from '@angular/core/testing';

import { PatientQuestionnaireService } from './patient-questionnaire.service';

describe('PatientQuestionnaireService', () => {
  let service: PatientQuestionnaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientQuestionnaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
