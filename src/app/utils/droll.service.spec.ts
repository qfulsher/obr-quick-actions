import { TestBed } from '@angular/core/testing';

import { DrollService } from './droll.service';

describe('RandomService', () => {
  let service: DrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
