// employee-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDataService {
  private employeeDataSubject = new BehaviorSubject<any[]>([]);
  employeeData$ = this.employeeDataSubject.asObservable();

  constructor() {
    const storedData = localStorage.getItem('employeeData');
    if (storedData) {
      this.updateEmployeeData(JSON.parse(storedData));
    }
  }

  updateEmployeeData(data: any[]) {
    this.employeeDataSubject.next(data);
    localStorage.setItem('employeeData', JSON.stringify(data)); // Store data in localStorage
  }
}
