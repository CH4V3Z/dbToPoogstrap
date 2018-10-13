import { TestBed, inject } from '@angular/core/testing';

import { DbapiService } from './dbapi.service';

describe('DbapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbapiService]
    });
  });

  it('should be created', inject([DbapiService], (service: DbapiService) => {
    expect(service).toBeTruthy();
  }));
});
