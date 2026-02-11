import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: 'register.component.html',
  styleUrl: 'register.component.css'
})

export class RegisterComponent {

  registerForm: FormGroup ;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false ;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router : Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName : ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required] ]
    }, {Validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void{
    // Invalid formular case
    if (this.registerForm.invalid){
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    // Initialization before submit
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true ;


    // Handle subscription
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading = false ;
        this.successMessage = 'Register Successful';

        setTimeout(() => {
          this.router.navigate(['/jobs']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched() ;
    })
  }

  get f() {
    return this.registerForm.controls;
  }
}
