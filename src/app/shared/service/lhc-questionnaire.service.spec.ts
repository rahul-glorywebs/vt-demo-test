import { TestBed } from '@angular/core/testing';

import { LhcQuestionnaireService } from './lhc-questionnaire.service';

describe('LhcQuestionnaireService', () => {
  let service: LhcQuestionnaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LhcQuestionnaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
