import { Body, Controller, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgetPasswordDto } from '../passwords/dto/forget-password.dto';
import { UpdatePasswordDto } from '../passwords/dto/update-password.dto';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async Login(@Body() createAuthDto: LoginUserDto) {
    // Trim and normalize email
    const email = createAuthDto.email?.trim().toLowerCase() || '';
    const password = createAuthDto.password?.trim() || '';
    
    return await this.authService.validateUser(email, password);
  }

  @Public()
  @Post('forget-password-email-link')
  async forgetPasswordEmailLink(
    @Query('hash') hash: string,
    @Query('email') email: string,
  ) {
    return await this.authService.verifyForgetPasswordEmail(email, hash);
  }

  @Public()
  @Post('verify-Otp')
  async verifyOtp(@Query('otp') otp: string, @Query('email') email: string) {
    return await this.authService.verifyOtp(email, otp);
  }

  @Public()
  @Post('verify-Email')
  async verifyEmail(
    @Query('hash') hash: string,
    @Query('email') email: string,
  ) {
    return await this.authService.verifyEmail(email, hash);
  }

  @Public()
  @Patch('update-Password')
  async updatePassword(@Body() UpdatePasswordDto: UpdatePasswordDto) {
    const { email, Password } = UpdatePasswordDto;
    return await this.authService.updatePassword(email, Password);
  }

  @Public()
  @Post('forget-Password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    try {
      const { email } = forgetPasswordDto;
      const result = await this.authService.forgetPassword(email);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
