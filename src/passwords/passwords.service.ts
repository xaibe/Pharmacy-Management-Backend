import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { EmailValidationsService } from '../email-validations/email-validations.service';
import { EmailsService } from '../emails/emails.service';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PasswordsService {
  constructor(
    private emailsService: EmailsService,
    private configService: ConfigService,
    private emailValidationService: EmailValidationsService,
    private prismaService: PrismaService,
  ) {}

  async updatePassword(email, password) {
    const hash = await this.hashPassword(password);
    const update = await this.prismaService.user.update({
      where: { emailAddress: email },
      data: { password: hash },
    });
    if (update) {
      const passwordChangeEmail = await this.emailsService.passwordChange(
        update,
      );
      return { message: 'password updated successfully', update };
    } else {
      throw new BadRequestException('unable to update password');
    }
  }
  async hashPassword(pass) {
    try {
      console.log('entered password hashing');

      const hash = await argon2.hash(pass, { type: argon2.argon2id });
      if (hash) {
        return hash;
      }
    } catch (err) {
      throw err;
    }
  }

  // In-memory OTP storage (TODO: Replace with database model)
  private otpStore: Map<string, { otp: string; retries: number; expiresAt: Date }> = new Map();

  async sendOtp(email: string) {
    try {
      const existing = this.otpStore.get(email);
      if (existing && existing.retries > 0 && existing.expiresAt > new Date()) {
        throw new BadRequestException(
          'OTP already sent, please check your email',
        );
      }
      
      const otp = Math.floor(Math.random() * 899999 + 100000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      this.otpStore.set(email, {
        otp,
        retries: 3,
        expiresAt,
      });

      return await this.emailsService.sendOtp(email, otp);
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string) {
    const stored = this.otpStore.get(email);
    if (!stored) {
      return false;
    }

    if (stored.expiresAt < new Date()) {
      this.otpStore.delete(email);
      return false;
    }

    if (stored.otp === otp) {
      this.otpStore.delete(email);
      return true;
    }

    stored.retries = stored.retries - 1;
    if (stored.retries <= 0) {
      this.otpStore.delete(email);
    }

    throw new BadRequestException(
      'You have entered an invalid OTP. Check your email and try again.',
    );
  }

  async comparePassword(password: string, userPassword: string): Promise<any> {
    try {
      const result = await argon2.verify(userPassword, password);
      return result;
    } catch (ex) {
      throw ex;
    }
  }

  generateRandomString(length) {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    return result;
  }

  createUrl(user: User, hash: string) {
    const url = `${
      this.configService.get('FORGET_PASSWORD_URL') +
      'v1/auth/forget-password-email-link'
    }?hash=${hash}&email=${user.emailAddress}`;
    return url;
  }

  async forgetPassword(user: User) {
    const hash = this.generateRandomString(7);
    const url = this.createUrl(user, hash);
    const emailValidation = {
      type: 'passwordValidation',
      hash: hash,
      active: false,
      userId: user.id,
    };
    const validate = await this.emailValidationService.create(emailValidation);

    if (validate) {
      await this.emailsService.forgetPassword(user, url);
      return { message: 'forgot password email sent' };
    }
  }
}
