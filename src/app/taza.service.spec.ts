import { TestBed } from '@angular/core/testing';

import { TazaService } from './taza.service';

describe('TazaService', () => {
  let service: TazaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TazaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
