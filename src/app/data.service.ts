import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private responseDataSubject = new BehaviorSubject<any>(null);
  responseData$ = this.responseDataSubject.asObservable();

  constructor() { }
  setResponseData(data: any): void {
    this.responseDataSubject.next(data);
  }
}
