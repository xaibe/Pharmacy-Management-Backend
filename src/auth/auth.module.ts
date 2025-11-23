import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountsModule } from 'src/accounts/accounts.module';
import { EmailValidationsModule } from 'src/email-validations/email-validations.module';
import { EmailsModule } from 'src/emails/emails.module';
import { PasswordsModule } from 'src/passwords/passwords.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './Strategies/jwt.strategy';
import { LocalStrategy } from './Strategies/local.strategy';
import { PasswordsService } from 'src/passwords/passwords.service';

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
