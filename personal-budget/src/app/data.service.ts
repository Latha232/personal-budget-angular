import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSource = new BehaviorSubject<any[]>([]); // Initialize with empty array
  dataSource$ = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  fetchDataFromBackend() {
    if (this.dataSource.getValue().length === 0) { // Check if data is empty
      this.http.get<any>('http://localhost:3000/budget')
        .subscribe(data => {
          this.dataSource.next(data.myBudget);
        });
    }
  }

  isDataEmpty(): boolean {
    return this.dataSource.getValue().length === 0;
  }
}
