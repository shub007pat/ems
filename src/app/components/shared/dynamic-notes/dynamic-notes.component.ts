import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Note {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
}

@Component({
  selector: 'app-dynamic-notes',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notes-container">
      <div class="notes-header">
        <h4>Employee Notes</h4>
        <button class="btn-add-note" (click)="toggleAddNote()">
          {{ showAddNote() ? 'Cancel' : 'Add Note' }}
        </button>
      </div>

      @if (showAddNote()) {
        <div class="add-note-form">
          <textarea
            [(ngModel)]="newNoteContent"
            placeholder="Enter your note here..."
            class="note-textarea"
            rows="3"
          ></textarea>
          <div class="form-actions">
            <button 
              class="btn-primary btn-sm" 
              (click)="addNote()"
              [disabled]="!newNoteContent.trim()"
            >
              Save Note
            </button>
          </div>
        </div>
      }

      <div class="notes-list">
        @if (notes().length === 0) {
          <div class="no-notes">
            <p>No notes available for this employee.</p>
            <p>Click "Add Note" to create the first note.</p>
          </div>
        } @else {
          @for (note of notes(); track note.id) {
            <div class="note-item">
              <div class="note-content">{{ note.content }}</div>
              <div class="note-meta">
                <span class="note-author">{{ note.author }}</span>
                <span class="note-timestamp">{{ note.timestamp | date:'short' }}</span>
                <button class="btn-delete" (click)="deleteNote(note.id)">×</button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .notes-container {
      padding: 1rem;
    }

    .notes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .notes-header h4 {
      margin: 0;
      color: #333;
    }

    .btn-add-note {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .btn-add-note:hover {
      background: #0056b3;
    }

    .add-note-form {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .note-textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.75rem;
      font-family: inherit;
      resize: vertical;
      margin-bottom: 0.5rem;
    }

    .note-textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-primary:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8rem;
    }

    .notes-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .no-notes {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
    }

    .no-notes p {
      margin: 0.5rem 0;
    }

    .note-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 0.75rem;
      transition: box-shadow 0.2s;
    }

    .note-item:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .note-content {
      margin-bottom: 0.75rem;
      line-height: 1.5;
      color: #333;
    }

    .note-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .note-author {
      font-weight: 500;
    }

    .note-timestamp {
      margin-left: auto;
      margin-right: 0.5rem;
    }

    .btn-delete {
      background: #dc3545;
      color: white;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      line-height: 1;
    }

    .btn-delete:hover {
      background: #c82333;
    }
  `]
})
export class DynamicNotesComponent {
  @Input() employeeId!: string;
  @Input() currentUser!: string;

  notes = signal<Note[]>([]);
  showAddNote = signal(false);
  newNoteContent = '';

  ngOnInit() {
    this.loadNotes();
  }

  toggleAddNote() {
    this.showAddNote.update(show => !show);
    if (!this.showAddNote()) {
      this.newNoteContent = '';
    }
  }

  addNote() {
    if (!this.newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: this.newNoteContent.trim(),
      timestamp: new Date(),
      author: this.currentUser || 'Unknown User'
    };

    this.notes.update(notes => [newNote, ...notes]);
    this.saveNotes();
    this.newNoteContent = '';
    this.showAddNote.set(false);
  }

  deleteNote(noteId: string) {
    this.notes.update(notes => notes.filter(note => note.id !== noteId));
    this.saveNotes();
  }

  private loadNotes() {
    const savedNotes = localStorage.getItem(`employee-notes-${this.employeeId}`);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          timestamp: new Date(note.timestamp)
        }));
        this.notes.set(parsedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }

  private saveNotes() {
    localStorage.setItem(`employee-notes-${this.employeeId}`, JSON.stringify(this.notes()));
  }
}
