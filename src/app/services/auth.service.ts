import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@company.com',
      username: 'admin',
      role: 'admin',
      password: 'admin123'
    },
    {
      id: '2',
      email: 'user@company.com',
      username: 'user',
      role: 'user',
      password: 'user123'
    }
  ];

  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }

  login(email: string, password: string): Observable<User> {
    const user = this.users.find(u => 
      (u.email === email || u.username === email) && u.password === password
    );

    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of(user).pipe(delay(1000));
    }

    return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
  }

  signup(email: string, username: string, password: string, role: 'admin' | 'user'): Observable<User> {
    const existingUser = this.users.find(u => u.email === email || u.username === username);
    
    if (existingUser) {
      return throwError(() => new Error('User already exists')).pipe(delay(1000));
    }

    const newUser: User = {
      id: this.generateId(),
      email,
      username,
      password,
      role
    };

    this.users.push(newUser);
    return of(newUser).pipe(delay(1000));
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
  }

  checkAuthStatus(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
