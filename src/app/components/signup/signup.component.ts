import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import * as EmployeeActions from '../../store/employee.actions';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading.set(true);
      this.error.set(null);
      this.success.set(null);

      const { email, password, role } = this.signupForm.value;

      this.authService.signup(email, email, password, role).subscribe({
        next: (user) => {
          const newEmployee: Employee = {
            id: this.generateId(),
            name: email.split('@')[0],
            email: email,
            department: '',
            mobile: '',
            position: '',
            isActive: true,
            joinDate: new Date()
          };

          this.store.dispatch(EmployeeActions.addEmployee({ employee: newEmployee }));

          this.loading.set(false);
          this.success.set('Account created successfully! You can now login.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error.message);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private markFormGroupTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
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
      if (field.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
