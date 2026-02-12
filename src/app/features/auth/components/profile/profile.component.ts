import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileForm: FormGroup;
  currentUser: Omit<User, 'password'> | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  showDeleteConfirm: boolean = false;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.currentUser?.id) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: Partial<User> = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email
    };

    // Only include password if it's been changed
    if (this.profileForm.value.password) {
      updateData.password = this.profileForm.value.password;
    }

    this.authService.updateProfile(this.currentUser.id, updateData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        this.profileForm.patchValue({ password: '' });
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Update failed. Please try again.';
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteAccount(): void {
    if (!this.currentUser?.id) return;

    this.isLoading = true;
    this.authService.deleteAccount(this.currentUser.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/register']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Delete failed. Please try again.';
        this.showDeleteConfirm = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get f() {
    return this.profileForm.controls;
  }
}
