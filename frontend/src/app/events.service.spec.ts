import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { EventsService } from './events.service';
import { LucideChevronLeft } from 'lucide-angular';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EventsService);
  });

  it('should be created', () => {
    // expect(service).toBeTruthy();
    expect(service).toBeFalsy();
  });
});
