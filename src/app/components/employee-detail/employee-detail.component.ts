import { Component, OnInit, signal, computed, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';
import { CardComponent } from '../shared/card/card.component';
import { MobileFormatPipe } from '../../pipes/mobile-format.pipe';
import { StatusHighlightDirective } from '../../directives/status-highlight.directive';
import { DynamicNotesComponent } from '../shared/dynamic-notes/dynamic-notes.component';
import { DeleteConfirmationModalComponent } from '../shared/delete-confirmation-modal/delete-confirmation-modal.component';

import * as EmployeeActions from '../../store/employee.actions';
import * as EmployeeSelectors from '../../store/employee.selectors';

@Component({
  selector: 'app-employee-detail',
  imports: [
    CommonModule, 
    RouterModule, 
    CardComponent, 
    MobileFormatPipe, 
    StatusHighlightDirective
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('dynamicNotesContainer', { read: ViewContainerRef }) dynamicNotesContainer!: ViewContainerRef;
  @ViewChild('deleteModalContainer', { read: ViewContainerRef }) deleteModalContainer!: ViewContainerRef;
  
  employee$: Observable<Employee | null | undefined>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  employeeId = signal<string>('');
  currentUser = signal<any>(null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  canEditThisEmployee = signal(false);
  showDynamicNotes = signal(false);
  
  private dynamicNotesComponentRef: ComponentRef<DynamicNotesComponent> | null = null;
  private deleteModalRef: ComponentRef<DeleteConfirmationModalComponent> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {
    this.currentUser.set(this.authService.getCurrentUser()());
    this.loading$ = this.store.select(EmployeeSelectors.selectEmployeeLoading);
    this.error$ = this.store.select(EmployeeSelectors.selectEmployeeError);
    this.employee$ = this.store.select(EmployeeSelectors.selectSelectedEmployee);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId.set(id);
      this.employee$ = this.store.select(EmployeeSelectors.selectEmployeeById(id));
      this.checkEditPermissions(id);
      this.store.dispatch(EmployeeActions.loadEmployees());
    }
  }

  checkEditPermissions(employeeId: string) {
    this.store.select(EmployeeSelectors.selectEmployeeById(employeeId)).subscribe(employee => {
      if (employee) {
        const currentUser = this.currentUser();
        this.canEditThisEmployee.set(employee.email === currentUser?.email);
      }
    });
  }

  ngAfterViewInit() {
    // Components can be loaded dynamically after the view is ready
  }

  toggleDynamicNotes() {
    this.showDynamicNotes.update(show => !show);
    
    if (this.showDynamicNotes()) {
      this.loadDynamicNotesComponent();
    } else {
      this.unloadDynamicNotesComponent();
    }
  }

  private async loadDynamicNotesComponent() {
    if (this.dynamicNotesComponentRef) {
      return;
    }

    try {
      this.dynamicNotesContainer.clear();
      this.dynamicNotesComponentRef = this.dynamicNotesContainer.createComponent(DynamicNotesComponent);
      
      this.dynamicNotesComponentRef.instance.employeeId = this.employeeId();
      this.dynamicNotesComponentRef.instance.currentUser = this.currentUser()?.username || 'Unknown User';
      this.dynamicNotesComponentRef.changeDetectorRef.detectChanges();
      
      console.log('Notes loaded successfully');
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  private unloadDynamicNotesComponent() {
    if (this.dynamicNotesComponentRef) {
      this.dynamicNotesComponentRef.destroy();
      this.dynamicNotesComponentRef = null;
    }
    this.dynamicNotesContainer.clear();
  }

  ngOnDestroy() {
    this.unloadDynamicNotesComponent();
    this.hideDeleteModal();
  }

  onEdit() {
    this.router.navigate(['/employee-form', this.employeeId()]);
  }

  onDelete() {
    this.employee$.subscribe(employee => {
      if (employee) {
        this.showDeleteModal(employee);
      }
    }).unsubscribe();
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
    this.router.navigate(['/employees']);
  }

  private hideDeleteModal() {
    if (this.deleteModalRef) {
      this.deleteModalRef.destroy();
      this.deleteModalRef = null;
    }
    this.deleteModalContainer?.clear();
  }

  goBack() {
    this.router.navigate(['/employees']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
