import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorLoggingService } from './error-logging.service';
import { ErrorLoggingController } from './error-logging.controller';
import { ErrorLoggingInterceptor } from './error-logging.interceptor';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [ErrorLoggingController],
  providers: [
    ErrorLoggingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggingInterceptor,
    },
  ],
  exports: [ErrorLoggingService],
})
export class ErrorLoggingModule {}

