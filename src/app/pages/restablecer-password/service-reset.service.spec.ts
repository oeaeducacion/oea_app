import { TestBed } from '@angular/core/testing';

import { ServiceResetService } from './service/service-reset.service';

describe('ServiceResetService', () => {
  let service: ServiceResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
