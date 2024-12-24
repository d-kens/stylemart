import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordMatchValidator } from '../../shared/validators/password-match';
import { CommonModule } from '@angular/common';
import { RegReqObject } from '../data-access/models/auth.model';
import { AuthService } from '../data-access/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  loading = false;

  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router) 

  registrationForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [Validators.required]),
  }, { validators: PasswordMatchValidator, updateOn: 'change' });

  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get lastName() {
    return this.registrationForm.get('lastName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get phone() {
    return this.registrationForm.get('phone');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }




  registerUser() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const registrationReqObject: RegReqObject = {
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      email: this.registrationForm.value.email,
      phoneNumber: this.registrationForm.value.phone,
      password: this.registrationForm.value.password,
    }

    this.authService.registerUser(registrationReqObject).subscribe({
      next: () => {
        this.loading = false;
        this.registrationForm.reset();
        this.toastr.success('Registration successful. You can now login');
        this.router.navigate(['auth/sign-in']);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 409) {
          this.toastr.error('Email already exists');
        } else {
          this.toastr.error('Intenal Server Error. Failed to register user');
        }
      }
     })

  }


 

}
