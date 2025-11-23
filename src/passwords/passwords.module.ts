import { Module } from '@nestjs/common';
import { EmailValidationsModule } from '../email-validations/email-validations.module';
import { EmailsModule } from '../emails/emails.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PasswordsController } from './passwords.controller';
import { PasswordsService } from './passwords.service';

@Module({
  imports: [
    EmailsModule,
    EmailValidationsModule,
    PrismaModule,
  ],
  controllers: [PasswordsController],
  providers: [
    PasswordsService,
  ],
})
export class PasswordsModule {}
