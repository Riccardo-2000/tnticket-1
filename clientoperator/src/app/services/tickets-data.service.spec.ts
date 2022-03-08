import { TestBed } from '@angular/core/testing';

import { TicketsDataService } from './tickets-data.service';

describe('TicketsDataService', () => {
  let service: TicketsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
