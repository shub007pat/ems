export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  mobile: string;
  isActive: boolean;
  joinDate: Date;
  position: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
