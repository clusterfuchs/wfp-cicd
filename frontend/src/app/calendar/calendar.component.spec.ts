import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LucideAngularModule, ChevronLeft, ChevronRight, Trash2, CirclePlus} from 'lucide-angular'
import { CalendarComponent } from './calendar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent, HttpClientTestingModule, LucideAngularModule.pick({ChevronLeft, ChevronRight, Trash2, CirclePlus}) ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
    expect(component).toBeNull();
  });
});
