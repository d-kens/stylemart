import { Routes } from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

export const routes: Routes = [
    {
        path: 'auth/sign-up',
        component: SignUpComponent
    },
    {
        path: 'auth/sign-in',
        component: SignInComponent
    },
    {
        path: 'auth/forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'auth/reset-password',
        component: ResetPasswordComponent,
    },
    {
        path: 'auth/verify-email',
        component: EmailVerificationComponent,
    }
];
