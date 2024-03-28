import { TestBed } from '@angular/core/testing';

import { ScanLabelService } from './scan-label.service';

describe('ScanLabelService', () => {
  let service: ScanLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
