import { TestBed } from '@angular/core/testing';

import { TechsService } from './techs.service';

describe('TechsService', () => {
  let service: TechsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
