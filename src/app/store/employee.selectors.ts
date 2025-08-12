import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.reducer';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

export const selectAllEmployees = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.employees
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.selectedEmployee
);

export const selectEmployeeLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.loading
);

export const selectEmployeeError = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.error
);

export const selectEmployeeFilter = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filter
);

export const selectFilteredEmployees = createSelector(
  selectAllEmployees,
  selectEmployeeFilter,
  (employees, filter) => {
    if (!filter) {
      return employees;
    }
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(filter.toLowerCase()) ||
      employee.department.toLowerCase().includes(filter.toLowerCase()) ||
      employee.email.toLowerCase().includes(filter.toLowerCase())
    );
  }
);

export const selectEmployeeById = (id: string) => createSelector(
  selectAllEmployees,
  (employees) => employees.find(employee => employee.id === id)
);
