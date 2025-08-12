# Employee Management System

A modern Angular application for managing employee data, showcasing the latest Angular features and best practices. This project demonstrates real-world implementation of signals, NgRx state management, dynamic components, and role-based permissions.

## Features

### What You Can Do
- **User Authentication**: Secure login and signup with different user roles
- **Employee Management**: Add, view, edit, and delete employee records
- **Smart Search**: Find employees by name, department, or email
- **Role-Based Access**: Different features for admins and regular users
- **Responsive**: Works great on phones, tablets, and desktops
- **Dynamic Loading**: Components load on-demand for better performance

### Technical Highlights
- **Standalone Components**: Modern Angular architecture
- **Angular Signals**: Reactive state management with signals, computed values, and effects
- **NgRx Store**: Global state management for employee data
- **Custom Pipes**: Mobile number formatting for consistent display
- **Custom Directives**: Visual status indicators
- **Route Guards**: Protect routes and warn about unsaved changes
- **Smart Routing**: Component state preservation during navigation
- **Content Projection**: Reusable card components
- **Dynamic Components**: Runtime component creation
- **Form Validation**: Comprehensive validation with helpful error messages

## Getting Started

### What You Need
- Node.js (version 18 or higher)
- npm (version 9 or higher)
- Angular CLI (version 17 or higher)

### Installation
1. Clone this repository
   ```bash
   git clone <repository-url>
   cd employee-management-system
   ```

2. Install dependencies
   ```bash
   npm install
   ```

### Running the App
1. Start the development server
   ```bash
   ng serve
   ```

2. Open your browser and go to `http://localhost:4200`

3. Try these demo accounts:
   - **Admin**: `admin@company.com` / `admin123`
   - **User**: `user@company.com` / `user123`

## Quick Start Guide

### New Users
1. Sign up for an account
2. Log in with your credentials
3. Browse the employee directory
4. Edit your phone number in your profile

### Admins
1. Log in with admin credentials
2. Add, edit, or delete employee records
3. Manage all employee data
4. Control user permissions

## Project Structure

```
src/app/
├── components/
│   ├── login/                     # User login
│   ├── signup/                    # User registration
│   ├── employee-list/             # Browse employees with search
│   ├── employee-detail/           # View employee details
│   ├── employee-form/             # Add/edit employees
│   └── shared/
│       ├── card/                  # Reusable card component
│       ├── dynamic-notes/         # Notes loaded on demand
│       └── delete-confirmation-modal/ # Delete confirmation
├── directives/
│   └── status-highlight.directive.ts  # Visual status indicators
├── guards/
│   ├── auth.guard.ts              # Login protection
│   ├── admin.guard.ts             # Admin-only features
│   └── can-deactivate.guard.ts    # Unsaved changes warning
├── models/
│   └── employee.model.ts          # Data models
├── pipes/
│   └── mobile-format.pipe.ts      # Phone number formatting
├── services/
│   ├── auth.service.ts            # Authentication
│   └── employee.service.ts        # Employee data
├── store/                         # NgRx state management
│   ├── employee.actions.ts
│   ├── employee.reducer.ts
│   ├── employee.effects.ts
│   └── employee.selectors.ts
└── strategies/
    └── route-reuse.strategy.ts    # Smart routing
```

## Cool Features to Try

### Angular Signals in Action
```typescript
// Reactive state that updates automatically
const searchTerm = signal('');
const isAdmin = computed(() => currentUser()?.role === 'admin');

// Side effects that respond to changes
effect(() => {
  this.employees$.subscribe(employees => {
    this.allEmployees.set(employees);
  });
});
```

### NgRx State Management
The app uses NgRx for managing employee data:
- Actions for loading, adding, updating, and deleting employees
- Reducers for updating state
- Effects for handling side effects
- Selectors for querying state

### Dynamic Component Loading
Modals and notes are loaded dynamically when needed:
```typescript
// Load a modal on demand
this.deleteModalRef = this.deleteModalContainer.createComponent(DeleteConfirmationModalComponent);
this.deleteModalRef.instance.employee = employee;
```

### Smart Permissions
The UI adapts based on what users can do:
```typescript
canEditEmployee(employee: Employee): boolean {
  const currentUser = this.currentUser();
  return currentUser?.role === 'admin' || employee.email === currentUser?.email;
}
```

### Custom Pipe
Phone numbers are formatted consistently:
- Input: `9876543210`
- Output: `(+91) 98765 43210`

### Custom Directive
Employee status gets visual highlighting:
- Active employees: Green
- Inactive employees: Red

### Route Protection
- **AuthGuard**: Must be logged in
- **AdminGuard**: Admin-only features
- **CanDeactivateGuard**: Warns about unsaved changes

### Reusable Components
Card component with flexible content:
```html
<app-card [title]="employee.name" [showFooter]="true">
  <!-- Your content here -->
  <div>Employee details...</div>
  
  <!-- Footer actions -->
  <div slot="footer">
    <button>Edit</button>
    <button>Delete</button>
  </div>
</app-card>
```

## User Roles

### Admin Users Can:
- Add, edit, and delete any employee
- Edit all employee fields
- Delete employees (with confirmation)
- Access all features

### Regular Users Can:
- View all employee data
- Edit only their own phone number
- View employee details
- Update their contact info

## Security & Validation

### Authentication
- Secure login system
- Role-based access control
- Route protection
- Component-level security checks

### Data Protection
- Form validation on all inputs
- Proper data handling
- Permission checks throughout the app

## Design & User Experience

### Modern Interface
- Responsive design
- Clean, professional styling
- Consistent colors and fonts
- Keyboard and screen reader friendly

### Interactive Elements
- Beautiful confirmation modals
- Loading indicators
- Smooth animations
- Visual status indicators

### User-Friendly Features
- Clear navigation
- Context-sensitive actions
- Helpful error messages
- Success confirmations

## State Management

### NgRx Store
```typescript
// Actions
export const loadEmployees = createAction('[Employee] Load Employees');
export const addEmployee = createAction('[Employee] Add Employee', props<{employee: Employee}>());

// Selectors
export const selectAllEmployees = createSelector(selectEmployeeState, state => state.employees);
```

### Local State with Signals
```typescript
const searchTerm = signal('');
const filteredEmployees = computed(() => {
  const term = this.searchTerm().toLowerCase();
  return this.allEmployees().filter(employee => 
    employee.name.toLowerCase().includes(term)
  );
});
```

## Browser Support
Works on all modern browsers: Chrome, Firefox, Safari, and Edge.

## License

This project is open source and available under the MIT License.

