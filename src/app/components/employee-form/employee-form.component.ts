import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';

import * as EmployeeActions from '../../store/employee.actions';
import * as EmployeeSelectors from '../../store/employee.selectors';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit, CanComponentDeactivate {
  employeeForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  isEditMode = signal(false);
  employeeId = signal<string | null>(null);
  currentUser = signal<any>(null);
  formSubmitted = signal(false);
  isAdmin = signal(false);
  isEditingOwnRecord = signal(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {
    this.currentUser.set(this.authService.getCurrentUser()());
    this.isAdmin.set(this.currentUser()?.role === 'admin');
    this.loading$ = this.store.select(EmployeeSelectors.selectEmployeeLoading);
    this.error$ = this.store.select(EmployeeSelectors.selectEmployeeError);

    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      position: ['', [Validators.required]],
      isActive: [true],
      joinDate: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.employeeId.set(id);
      this.checkEditPermissions(id);
      this.loadEmployee(id);
    } else {
      const currentUser = this.currentUser();
      if (currentUser?.role !== 'admin') {
        alert('Only administrators can add new employees.');
        this.router.navigate(['/employees']);
      }
    }
  }

  checkEditPermissions(employeeId: string) {
    const currentUser = this.currentUser();
    
    if (currentUser?.role !== 'admin') {
      this.store.select(EmployeeSelectors.selectEmployeeById(employeeId)).subscribe(employee => {
        if (employee && employee.email !== currentUser?.email) {
          alert('You can only edit your own employee details.');
          this.router.navigate(['/employees']);
        }
      });
    }
  }

  loadEmployee(id: string) {
    this.store.select(EmployeeSelectors.selectEmployeeById(id)).subscribe(employee => {
      if (employee) {
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          department: employee.department,
          mobile: employee.mobile,
          position: employee.position,
          isActive: employee.isActive,
          joinDate: this.formatDateForInput(employee.joinDate)
        });

        const currentUser = this.currentUser();
        this.isEditingOwnRecord.set(employee.email === currentUser?.email);

        if (!this.isAdmin() && this.isEditingOwnRecord()) {
          this.employeeForm.get('name')?.disable();
          this.employeeForm.get('email')?.disable();
          this.employeeForm.get('department')?.disable();
          this.employeeForm.get('position')?.disable();
          this.employeeForm.get('isActive')?.disable();
          this.employeeForm.get('joinDate')?.disable();
        }
      }
    });
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.getRawValue();
      const employee: Employee = {
        id: this.employeeId() || this.generateId(),
        name: formValue.name,
        email: formValue.email,
        department: formValue.department,
        mobile: formValue.mobile,
        position: formValue.position,
        isActive: formValue.isActive,
        joinDate: new Date(formValue.joinDate)
      };

      if (this.isEditMode()) {
        this.store.dispatch(EmployeeActions.updateEmployee({ employee }));
      } else {
        this.store.dispatch(EmployeeActions.addEmployee({ employee }));
      }

      this.formSubmitted.set(true);
      this.router.navigate(['/employees']);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }

  canDeactivate(): boolean {
    if (this.formSubmitted()) {
      return true;
    }
    
    if (this.employeeForm.dirty) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    
    return true;
  }

  private markFormGroupTouched() {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email';
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid 10-digit mobile number';
      }
    }
    return '';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
