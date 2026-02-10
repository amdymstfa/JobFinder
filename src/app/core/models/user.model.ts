// Global interface for user
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Login interface for
export interface UserLogin {
  email: string;
  password: string;
}

// Register interface for user
export interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// Response after auth
export interface AuthResponse {
  user: Omit<User, 'password'>
}
