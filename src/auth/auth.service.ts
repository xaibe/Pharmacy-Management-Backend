/* eslint-disable prefer-const */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailValidationsService } from 'src/email-validations/email-validations.service';
import { PasswordsService } from 'src/passwords/passwords.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly passwordsService: PasswordsService,
    private readonly emailValidationService: EmailValidationsService,
  ) {}

  async forgetPassword(email: string) {
    const user = await this.usersService.getByEmail(email);
    return await this.passwordsService.forgetPassword(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(email, pass);
    if (user) {
      // Check if email is verified (using emailVerifiedAt as active indicator)
      // For development, allow login even if email is not verified
      // In production, you may want to enforce email verification
      if (user.emailVerifiedAt) {
        const newUser = await this.loginUser(user);
        return newUser;
      } else {
        // For now, allow login even without email verification
        // Uncomment the line below to enforce email verification
        // return await this.passwordsService.sendOtp(email);
        const newUser = await this.loginUser(user);
        return newUser;
      }
    } else {
      throw new UnauthorizedException('Invalid User Name or password');
    }
  }

  async updatePassword(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    const verify = await this.emailValidationService.verify(user.id);
    if (verify) {
      const update = await this.passwordsService.updatePassword(
        email,
        password,
      );
      if (update) {
        await this.emailValidationService.delete(verify.id);
        return update;
      }
    }
  }

  async verifyEmail(email: string, hash: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // TODO: Implement actual hash validation when EmailValidation model is added
      // For now, verify the email directly
      const activateUser = await this.usersService.verifyEmail(user.id);
      return activateUser;
    } catch (err) {
      throw err;
    }
  }

  async verifyOtp(email, otp) {
    const verify = await this.passwordsService.verifyOtp(email, otp);
    if (verify) {
      const user = await this.usersService.getByEmail(email);
      return await this.usersService.activate(user.id);
    } else {
      throw new BadRequestException('Unabel to verify');
    }
  }

  async verifyForgetPasswordEmail(email: string, hash: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // TODO: Implement actual hash validation when EmailValidation model is added
      // For now, return success
      return { message: 'validation successful' };
    } catch (err) {
      throw err;
    }
  }

  async loginUser(user: any) {
    const access_token = await this.generateToken(user);
    return {
      access_token: access_token,
      user,
    };
  }

  async generateToken(user: any) {
    const payload = {
      email: user.emailAddress,
      sub: user.id,
      id: user.id,
      username: user.username,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
