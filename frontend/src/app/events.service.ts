import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  url= "http://127.0.0.1:3000/events";

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any>{
    return this.http.get(this.url, {headers: { Accept: 'application/json'}});
  }

  createEvent(title: string, start_date: Date, end_date: Date, color: string): Observable<any>{
    let body: object = {
      title: title,
      start_date: start_date,
      end_date: end_date,
      color: color ? color : "event-green" 
    }
    return this.http.post(this.url, body ,{ headers: { Accept: 'application/json'}});
  }

  updateEvent(id: string, body: object): Observable<any>{
    return this.http.patch(this.url + "/" + id, body, {headers: { Accept: 'application/json'}});
  }

  deleteEvent(id: string): Observable<any>{
    return this.http.delete(this.url + "/" + id, {headers: { Accept: 'application/json'}});
  }
}
