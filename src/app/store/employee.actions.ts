import { createAction, props } from '@ngrx/store';
import { Employee } from '../models/employee.model';

// Load Employees
export const loadEmployees = createAction('[Employee] Load Employees');
export const loadEmployeesSuccess = createAction(
  '[Employee] Load Employees Success',
  props<{ employees: Employee[] }>()
);
export const loadEmployeesFailure = createAction(
  '[Employee] Load Employees Failure',
  props<{ error: string }>()
);

// Add Employee
export const addEmployee = createAction(
  '[Employee] Add Employee',
  props<{ employee: Employee }>()
);
export const addEmployeeSuccess = createAction(
  '[Employee] Add Employee Success',
  props<{ employee: Employee }>()
);
export const addEmployeeFailure = createAction(
  '[Employee] Add Employee Failure',
  props<{ error: string }>()
);

// Update Employee
export const updateEmployee = createAction(
  '[Employee] Update Employee',
  props<{ employee: Employee }>()
);
export const updateEmployeeSuccess = createAction(
  '[Employee] Update Employee Success',
  props<{ employee: Employee }>()
);
export const updateEmployeeFailure = createAction(
  '[Employee] Update Employee Failure',
  props<{ error: string }>()
);

// Delete Employee
export const deleteEmployee = createAction(
  '[Employee] Delete Employee',
  props<{ id: string }>()
);
export const deleteEmployeeSuccess = createAction(
  '[Employee] Delete Employee Success',
  props<{ id: string }>()
);
export const deleteEmployeeFailure = createAction(
  '[Employee] Delete Employee Failure',
  props<{ error: string }>()
);

// Select Employee
export const selectEmployee = createAction(
  '[Employee] Select Employee',
  props<{ employee: Employee | null }>()
);

// Filter Employees
export const filterEmployees = createAction(
  '[Employee] Filter Employees',
  props<{ filter: string }>()
);
