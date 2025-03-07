import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Event } from '../event';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, CommonModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})

export class CalendarComponent implements OnInit{
  today: Date = new Date;
  selectedDate: Date = this.today;
  month: number = this.today.getMonth();
  year: number = this.today.getFullYear();
  day: number = this.today.getDate();

// Month and Weekday Strings
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  weekdays: string[] = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
  monthString: string = this.months[this.month];
  dayString: string = this.weekdays[this.day];

// Month informations
  firstDay: number = new Date(this.year,this.month,1).getDay(); 
  monthDays: number = this.daysInMonth(this.month, this.year);
  lastMonthDays: number = this.month == 1 ? this.daysInMonth(12, this.year) : this.daysInMonth(this.month-1, this.year);

  dayArray: any[] = this.getDayArray(this.firstDay,this.monthDays, this.year, this.month);
  blankArray: any[] = this.getBlankArray(this.firstDay,this.lastMonthDays, this.year,this.month); 
  blankArrayAfter: any[] = this.getBlankArrayAfter(this.firstDay,this.monthDays,this.year,this.month);

  events!: Event[]; 
  event: Event | null = {
      '_id': null,
      'title': "",
      'start_date': new Date(),
      'end_date': new Date(),
      'color': 'event-green'
  };
  color: string = 'event-green';

  applyForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl(''),
    start_date: new FormControl(null),
    end_date: new FormControl(null),
    color: new FormControl('')
  });

  ngOnInit(): void {
     this.getEvents();
  }

  constructor(private eventsService: EventsService){}

// Current and previous Month Number of Days
  daysInMonth(month: number,year: number): number{
      return new Date(year,month + 1,0).getDate();
  }

//Date methods
  getDayArray(firstWeekday:number, monthDays: number, year: number, month: number): object[]{
      const monthArray = []; 

      for(let days: number = 0; days < monthDays; days++){
          let day = { id: (days + firstWeekday - 1), date: new Date(year,month,days + 1)}
          monthArray.push(day);
      }
      return monthArray;
  }
  getBlankArray(firstWeekday:number, lastMonthDays: number, year: number, month: number): object[]{
      const blankArray = [];

      if(firstWeekday == 0) firstWeekday = 7;
      for(let days: number = firstWeekday - 1; days > 0; days--){
          let day = { id: (firstWeekday - days - 1), date: new Date(year,month-1, lastMonthDays - days + 1) };
          blankArray.push(day);
      }
      return blankArray;
  }
  getBlankArrayAfter(firstWeekday:number, monthDays: number, year: number, month: number): object[]{
      const blankArrayAfter = [];
      if(firstWeekday == 0) firstWeekday = 7;

      let restDays = 43 - firstWeekday - monthDays;
      for(let days: number = 0; days < restDays; days++){
          let day = { id: (days + firstWeekday + monthDays - 1), date: new Date(year, month + 1, days + 1) };
          blankArrayAfter.push(day);
      }
      return blankArrayAfter;
  }

//Change date methods
  updateArrays(): void{
    this.monthString = this.months[this.month];

    this.firstDay = new Date(this.year,this.month,1).getDay(); 
    this.monthDays = this.daysInMonth(this.month, this.year);
    this.lastMonthDays = this.month == 1 ? this.daysInMonth(12, this.year) : this.daysInMonth(this.month-1, this.year);

    this.dayArray = this.getDayArray(this.firstDay,this.monthDays, this.year, this.month);
    this.blankArray = this.getBlankArray(this.firstDay,this.lastMonthDays, this.year,this.month); 
    this.blankArrayAfter = this.getBlankArrayAfter(this.firstDay,this.monthDays,this.year,this.month);
  }
  setYear(newYear: number): void{
    this.year = newYear;
    this.updateArrays();
    }

  setMonth(newMonth: number): void{
    console.log(newMonth);
    if(newMonth == 12) {
      newMonth = 0;
      this.setYear(this.year + 1);
    }
    if (newMonth == -1) {
      newMonth = 11;
      this.setYear(this.year - 1);
    }
    this.month = newMonth;
    this.updateArrays();
    }
  changeActiveDate(element: any): void{
    this.selectedDate = element.date;
  }

//Event Methods
  submitEvent(): void{
      let form = this.applyForm.controls;
      if(!this.event?._id){
          this.createEvent(
            form.title.value ?? '',
            new Date(form.start_date.value ?? ''),
            new Date(form.end_date.value ?? ''),
            form.color.value ?? "event-green"
          );
          return
      }

      let formEvent: Event ={
        _id: this.event!._id,
        title: form.title.value ? form.title.value : this.event.title,
        start_date: new Date(form.start_date.value ?? this.event.start_date),
        end_date: new Date(form.end_date.value ?? this.event.end_date),
        color: form.color.value ? form.color.value : this.event.color
      }
      this.updateEvent(this.event!._id,formEvent)
}

  setEvent(event: Event | null): void{
    this.event = event;
  }

  eventOnSelectedDay(): boolean{
    if(this.events && this.events.filter((event: Event) => event.start_date.toDateString() === this.selectedDate.toDateString() || (event.start_date <= this.selectedDate && event.end_date >= this.selectedDate))[0] == null){
      return true;
    }
    return false;
  }

//Async event methods
  getEvents(): void{
    this.eventsService.getEvents().subscribe((data: any) => {
      this.events = data as Event[];
      this.events.forEach(event => event.start_date = new Date(event.start_date))
      this.events.forEach(event => event.end_date = new Date(event.end_date))
    })
  }

  createEvent(title: string, start_date: Date, end_date: Date, color: string): void{
    this.eventsService.createEvent(title, start_date, end_date, color).subscribe((data: any) =>{
        this.getEvents();
    })
  }

  updateEvent(_id: string, body: object): void{
    this.eventsService.updateEvent(_id, body).subscribe((data: any) =>{
        this.getEvents();
    })
  }

  deleteEvent(_id: string | null): void{
    if(_id){
      this.eventsService.deleteEvent(_id).subscribe(() =>{
        this.getEvents();
      })
    }
  }
}
