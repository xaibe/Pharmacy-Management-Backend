import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailValidationsService } from './email-validations.service';

@Module({
  imports: [PrismaModule],
  providers: [EmailValidationsService],
  exports: [EmailValidationsService],
})
export class EmailValidationsModule {}

