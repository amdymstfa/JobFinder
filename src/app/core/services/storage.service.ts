import {Injectable} from "@angular/core";
import {User} from "../models/user.model";

@Injectable({providedIn: 'root'})

export class StorageService {
  private readonly USER_KEY = 'jobfinder_user';

  // Save user
  saveUser(user: Omit<User, 'password'>){
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get user
  getUser(): Omit<User, 'password'> | null{
    const user = sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null ;
  }

  // Check user logged
  isLoggedIn(): boolean {
    return this.getUser() !== null ;
  }

  // Remove user from local storage
  removeUser() : void {
    sessionStorage.removeItem(this.USER_KEY);
  }

  // clear local storage
  clearStorage(): void {
    sessionStorage.clear();
  }
}
