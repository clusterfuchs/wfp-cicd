import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  url= "http://192.168.30.200:3000/events";

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any>{
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    })
    
    const random = new Date().getTime(); 
    const cacheBustedUrl = `${this.url}?_=${random}`;

    return this.http.get(cacheBustedUrl, {headers: headers});
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
