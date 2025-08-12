import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { EmployeeService } from '../services/employee.service';
import * as EmployeeActions from './employee.actions';

@Injectable()
export class EmployeeEffects {
  private actions$ = inject(Actions);
  private employeeService = inject(EmployeeService);

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      mergeMap(() =>
        this.employeeService.getEmployees().pipe(
          map(employees => EmployeeActions.loadEmployeesSuccess({ employees })),
          catchError(error => of(EmployeeActions.loadEmployeesFailure({ error: error.message })))
        )
      )
    )
  );

  addEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.addEmployee),
      mergeMap(action =>
        this.employeeService.addEmployee(action.employee).pipe(
          map(employee => EmployeeActions.addEmployeeSuccess({ employee })),
          catchError(error => of(EmployeeActions.addEmployeeFailure({ error: error.message })))
        )
      )
    )
  );

  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      mergeMap(action =>
        this.employeeService.updateEmployee(action.employee).pipe(
          map(employee => EmployeeActions.updateEmployeeSuccess({ employee })),
          catchError(error => of(EmployeeActions.updateEmployeeFailure({ error: error.message })))
        )
      )
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      mergeMap(action =>
        this.employeeService.deleteEmployee(action.id).pipe(
          map(() => EmployeeActions.deleteEmployeeSuccess({ id: action.id })),
          catchError(error => of(EmployeeActions.deleteEmployeeFailure({ error: error.message })))
        )
      )
    )
  );
}
