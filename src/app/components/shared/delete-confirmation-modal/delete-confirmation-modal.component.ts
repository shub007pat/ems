import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Confirm Delete</h3>
          <button class="close-button" (click)="onCancel()">×</button>
        </div>
        
        <div class="modal-body">
          <h4>Are you sure you want to delete this employee?</h4>
        </div>
        
        <div class="modal-footer">
          <button 
            class="btn-secondary" 
            (click)="onCancel()"
            [disabled]="isDeleting()"
          >
            Cancel
          </button>
          <button 
            class="btn-danger" 
            (click)="onConfirm()"
            [disabled]="isDeleting()"
          >
            @if (isDeleting()) {
              <span class="spinner"></span>
              Deleting...
            } @else {
              Delete
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideIn 0.3s ease-out;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f9fa;
      border-radius: 8px 8px 0 0;
    }

    .modal-header h3 {
      margin: 0;
      color: #dc3545;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6c757d;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .close-button:hover {
      background: #e9ecef;
      color: #495057;
    }

    .modal-body {
      padding: 2rem;
      text-align: center;
    }

    .warning-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .modal-body h4 {
      color: #dc3545;
      margin: 0 0 1.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .employee-info {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 1rem;
      margin: 1.5rem 0;
      text-align: left;
    }

    .employee-info p {
      margin: 0.5rem 0;
      font-size: 0.9rem;
      color: #495057;
    }

    .employee-info strong {
      color: #212529;
      font-weight: 600;
    }

    .warning-message {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 1rem;
      margin-top: 1.5rem;
    }

    .warning-message p {
      margin: 0;
      color: #856404;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
      background: #f8f9fa;
      border-radius: 0 0 8px 8px;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 100px;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
      transform: translateY(-1px);
    }

    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c82333;
      transform: translateY(-1px);
    }

    .btn-danger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { 
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .modal-container {
        width: 95%;
        margin: 1rem;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 1rem;
      }

      .modal-footer {
        flex-direction: column;
      }

      .btn-secondary,
      .btn-danger {
        width: 100%;
      }
    }
  `]
})
export class DeleteConfirmationModalComponent {
  @Input() employee: Employee | null = null;
  @Output() confirmed = new EventEmitter<Employee>();
  @Output() cancelled = new EventEmitter<void>();

  isDeleting = signal(false);

  onConfirm() {
    if (this.employee && !this.isDeleting()) {
      this.isDeleting.set(true);
      setTimeout(() => {
        this.confirmed.emit(this.employee!);
      }, 500);
    }
  }

  onCancel() {
    if (!this.isDeleting()) {
      this.cancelled.emit();
    }
  }
}
