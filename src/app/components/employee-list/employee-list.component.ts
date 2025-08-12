import { Component, OnInit, signal, computed, effect, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';
import { CardComponent } from '../shared/card/card.component';
import { MobileFormatPipe } from '../../pipes/mobile-format.pipe';
import { StatusHighlightDirective } from '../../directives/status-highlight.directive';
import { DeleteConfirmationModalComponent } from '../shared/delete-confirmation-modal/delete-confirmation-modal.component';

import * as EmployeeActions from '../../store/employee.actions';
import * as EmployeeSelectors from '../../store/employee.selectors';

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    CardComponent, 
    MobileFormatPipe, 
    StatusHighlightDirective
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  @ViewChild('deleteModalContainer', { read: ViewContainerRef }) deleteModalContainer!: ViewContainerRef;
  
  employees$: Observable<Employee[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  searchTerm = signal('');
  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allEmployees();
    
    return this.allEmployees().filter(employee =>
      employee.name.toLowerCase().includes(term) ||
      employee.department.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term)
    );
  });

  private allEmployees = signal<Employee[]>([]);
  currentUser = signal<any>(null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  
  private deleteModalRef: ComponentRef<DeleteConfirmationModalComponent> | null = null;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser.set(this.authService.getCurrentUser()());
    this.employees$ = this.store.select(EmployeeSelectors.selectAllEmployees);
    this.loading$ = this.store.select(EmployeeSelectors.selectEmployeeLoading);
    this.error$ = this.store.select(EmployeeSelectors.selectEmployeeError);

    // Keep local employee list in sync with the store
    effect(() => {
      this.employees$.subscribe(employees => {
        this.allEmployees.set(employees);
      });
    });
  }

  ngOnInit() {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onEdit(employee: Employee) {
    this.router.navigate(['/employee-form', employee.id]);
  }

  onDelete(employee: Employee) {
    this.showDeleteModal(employee);
  }

  private async showDeleteModal(employee: Employee) {
    this.hideDeleteModal();

    try {
      this.deleteModalRef = this.deleteModalContainer.createComponent(DeleteConfirmationModalComponent);
      this.deleteModalRef.instance.employee = employee;
      
      this.deleteModalRef.instance.confirmed.subscribe((confirmedEmployee: Employee) => {
        this.handleDeleteConfirmed(confirmedEmployee);
      });
      
      this.deleteModalRef.instance.cancelled.subscribe(() => {
        this.hideDeleteModal();
      });
      
      this.deleteModalRef.changeDetectorRef.detectChanges();
      
    } catch (error) {
      console.error('Error loading delete confirmation modal:', error);
    }
  }

  private handleDeleteConfirmed(employee: Employee) {
    this.store.dispatch(EmployeeActions.deleteEmployee({ id: employee.id }));
    this.hideDeleteModal();
  }

  private hideDeleteModal() {
    if (this.deleteModalRef) {
      this.deleteModalRef.destroy();
      this.deleteModalRef = null;
    }
    this.deleteModalContainer?.clear();
  }

  onAdd() {
    if (this.isAdmin()) {
      this.router.navigate(['/employee-form']);
    } else {
      alert('Only administrators can add new employees.');
    }
  }

  canEditEmployee(employee: Employee): boolean {
    const currentUser = this.currentUser();
    return currentUser?.role === 'admin' || employee.email === currentUser?.email;
  }

  canDeleteEmployee(employee: Employee): boolean {
    return this.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.hideDeleteModal();
  }
}
