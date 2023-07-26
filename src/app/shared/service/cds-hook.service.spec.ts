import { TestBed } from '@angular/core/testing';

import { CdshookService } from './cds-hook.service';

describe('CdshookService', () => {
  let service: CdshookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CdshookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
