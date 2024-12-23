import { Routes } from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';

export const routes: Routes = [
    {
        path: 'auth/sign-up',
        component: SignUpComponent
    },
    {
        path: 'auht/email-verification',
        component: EmailVerificationComponent
    },
    {
        path: 'auth/sign-in',
        component: SignInComponent
    }
];
