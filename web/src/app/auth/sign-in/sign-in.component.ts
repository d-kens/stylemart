import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthReqObject } from '../data-access/models/auth.model';
import { AuthService } from '../data-access/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loading = false;

  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router)

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


  loginUser() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const loginReqObject: AuthReqObject= {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }

    this.authService.login(loginReqObject).subscribe({
      next: (response) => {
        this.authService.storeAccessToken(response.accessToken);
        this.authService.updateAuthenticationStatus(true);
        this.loading = false;
        this.loginForm.reset();
        this.toastr.success('Login successful');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        console.log("THIS IS THE ERROR", error)
        if(error.status === 401) {
          this.toastr.error('Unauthorized. Invalid email or password');
        } else {
          this.toastr.error('Internal Server Error. Failed to login');
          console.log(error)
        }
      }
 
    })

  }

}
