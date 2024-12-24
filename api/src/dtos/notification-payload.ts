export interface OtpNotification {
  clientEmail: string;
  otp: string;
  otpLifeSpan: number;
}

export interface EmailVerificationNotification {
  clientEmail: string;
  verificationLink: string;
}

export interface PasswordResetNotification {
  clientEmail: string;
  resetLink: string;
}
