import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountsModule } from '../accounts/accounts.module';
import { EmailValidationsModule } from '../email-validations/email-validations.module';
import { EmailsModule } from '../emails/emails.module';
import { PasswordsModule } from '../passwords/passwords.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './Strategies/jwt.strategy';
import { LocalStrategy } from './Strategies/local.strategy';
import { PasswordsService } from '../passwords/passwords.service';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AccountsModule,
    EmailsModule,
    EmailValidationsModule,
    PasswordsModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5d' },
    }),
  ],

  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    PasswordsService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
