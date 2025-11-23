import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailsService {
  async sendEmail(to: string, subject: string, content: string) {
    // TODO: Implement actual email sending logic
    // For now, just log the email details
    console.log(`Email would be sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    
    return { success: true, message: 'Email sent successfully' };
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const subject = 'Password Reset Request';
    const content = `Your password reset token is: ${resetToken}`;
    
    return this.sendEmail(email, subject, content);
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    const subject = 'Email Verification';
    const content = `Please verify your email with this token: ${verificationToken}`;
    
    return this.sendEmail(email, subject, content);
  }

  async passwordChange(user: any) {
    const subject = 'Password Changed';
    const content = `Your password has been changed successfully.`;
    return this.sendEmail(user.emailAddress, subject, content);
  }

  async sendOtp(email: string, otp: string) {
    const subject = 'OTP Verification';
    const content = `Your OTP is: ${otp}`;
    return this.sendEmail(email, subject, content);
  }

  async forgetPassword(user: any, url: string) {
    const subject = 'Password Reset';
    const content = `Please reset your password using this link: ${url}`;
    return this.sendEmail(user.emailAddress, subject, content);
  }
} 