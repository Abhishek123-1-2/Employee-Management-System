import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmpformService {
  private apiUrl = 'http://localhost:3000/api/employees';
  constructor(private http: HttpClient) {}

  // Add an employee to the database
  addEmployee(employeeData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employeeData).pipe(
      catchError((error) => {
        console.error('Error adding employee:', error);
        return throwError('An error occurred while adding the employee.');
      })
    );
  }

  // Fetch all employees from the database
  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {

        console.error('Error fetching employees:', error);
        return throwError('An error occurred while fetching employees.');
      })
    );
  }


  getEmployeeById(empId: number): Observable<any> {
    const url = `${this.apiUrl}/${empId}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error fetching employee by ID:', error);
        return throwError('An error occurred while fetching employee by ID.');
      })
    );
  }
  deleteEmployee(empId: number): Observable<any> {
    const url = `${this.apiUrl}/${empId}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Error deleting employee:', error);
        return throwError('An error occurred while deleting the employee.');
      })
    );
  }
// Add this method to your empform.service.ts
updateEmployee(employeeData: any): Observable<any> {
  const url = `${this.apiUrl}/${employeeData.emp_id}`;
  return this.http.put<any>(url, employeeData).pipe(
    catchError((error) => {
      console.error('Error updating employee:', error);
      return throwError('An error occurred while updating the employee.');
    })
  );
}

  

  
}
