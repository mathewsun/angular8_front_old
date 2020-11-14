import { TestBed } from '@angular/core/testing';

import { HttpTransportService } from './http-transport.service';

describe('HttpTransportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpTransportService = TestBed.get(HttpTransportService);
    expect(service).toBeTruthy();
  });
});
