import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { AuthResponse, User, UserLogin, UserRegister } from "../models/user.model";
import { catchError, map, Observable, switchMap, tap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {

  // API URL from environment
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  /**
   * Register a new user
   */
  register(userData: UserRegister): Observable<AuthResponse> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${userData.email}`).pipe(

      // Check if user already exists
      map((users: User[]) => {
        if (users.length > 0) {
          throw new Error('Email already exists');
        }
        return userData;
      }),

      // Remove confirmPassword before sending to server
      map((user: UserRegister) => {
        const { confirmPassword, ...userToCreate } = user;
        return userToCreate;
      }),

      // Send data to server
      switchMap(userToCreate =>
        this.http.post<User>(this.apiUrl, userToCreate)
      ),

      // Remove password before storing in session
      map((user: User) => {
        const { password, ...userWithoutPassword } = user;
        this.storageService.saveUser(userWithoutPassword);

        return {
          user: userWithoutPassword
        };
      })
    );
  }

  /**
   * Login user
   */
  login(credentials: UserLogin): Observable<AuthResponse> {
    return this.http.get<User[]>(
      `${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`
    ).pipe(
      map((users: User[]) => {

        if (users.length === 0) {
          throw new Error('Invalid email or password');
        }

        const user = users[0];
        const { password, ...userWithoutPassword } = user;

        this.storageService.saveUser(userWithoutPassword);

        return {
          user: userWithoutPassword
        };
      }),
      catchError(() =>
        throwError(() => new Error('Invalid email or password'))
      )
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.storageService.removeUser();
  }

  /**
   * Get current logged user
   */
  getCurrentUser(): Omit<User, 'password'> | null {
    return this.storageService.getUser();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.storageService.isLoggedIn();
  }

  /**
   * Update user profile
   */
  updateProfile(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, userData).pipe(
      tap(user => {
        const { password, ...userWithoutPassword } = user;
        this.storageService.saveUser(userWithoutPassword);
      })
    );
  }

  /**
   * Delete account
   */
  deleteAccount(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      tap(() => this.logout())
    );
  }

}
