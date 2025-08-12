import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      mobile: '9876543210',
      isActive: true,
      joinDate: new Date('2022-01-15'),
      position: 'Senior Developer'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Marketing',
      mobile: '9876543211',
      isActive: true,
      joinDate: new Date('2021-06-10'),
      position: 'Marketing Manager'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      department: 'HR',
      mobile: '9876543212',
      isActive: false,
      joinDate: new Date('2020-03-20'),
      position: 'HR Specialist'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: 'Engineering',
      mobile: '9876543213',
      isActive: true,
      joinDate: new Date('2023-02-01'),
      position: 'Frontend Developer'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@company.com',
      department: 'Sales',
      mobile: '9876543214',
      isActive: true,
      joinDate: new Date('2022-08-15'),
      position: 'Sales Executive'
    },
    {
      id: 'admin-emp',
      name: 'Admin User',
      email: 'admin@company.com',
      department: 'Management',
      mobile: '9876543215',
      isActive: true,
      joinDate: new Date('2020-01-01'),
      position: 'System Administrator'
    },
    {
      id: 'user-emp',
      name: 'Demo User',
      email: 'user@company.com',
      department: 'Operations',
      mobile: '9876543216',
      isActive: true,
      joinDate: new Date('2023-01-01'),
      position: 'Operations Specialist'
    }
  ];

  getEmployees(): Observable<Employee[]> {
    return of([...this.employees]).pipe(delay(500));
  }

  getEmployeeById(id: string): Observable<Employee | undefined> {
    const employee = this.employees.find(emp => emp.id === id);
    return of(employee).pipe(delay(300));
  }

  addEmployee(employee: Employee): Observable<Employee> {
    const newEmployee = {
      ...employee,
      id: this.generateId()
    };
    this.employees.push(newEmployee);
    return of(newEmployee).pipe(delay(500));
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const index = this.employees.findIndex(emp => emp.id === employee.id);
    if (index !== -1) {
      this.employees[index] = employee;
      return of(employee).pipe(delay(500));
    }
    return throwError(() => new Error('Employee not found'));
  }

  deleteEmployee(id: string): Observable<void> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    return throwError(() => new Error('Employee not found'));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
