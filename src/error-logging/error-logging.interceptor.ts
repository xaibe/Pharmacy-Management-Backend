import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLoggingService } from './error-logging.service';
import { ErrorSeverity } from '@prisma/client';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  constructor(private readonly errorLoggingService: ErrorLoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      catchError((error) => {
        // Determine severity based on status code
        let severity: ErrorSeverity = ErrorSeverity.MEDIUM;
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          if (statusCode >= 500) {
            severity = ErrorSeverity.HIGH;
          } else if (statusCode >= 400) {
            severity = ErrorSeverity.MEDIUM;
          } else {
            severity = ErrorSeverity.LOW;
          }
        } else {
          severity = ErrorSeverity.CRITICAL;
        }

        // Extract error information
        const errorMessage = error.message || 'Unknown error';
        const errorStack = error.stack;
        const errorType = error.constructor?.name || 'Error';

        // Get request information
        const path = request.url;
        const method = request.method;
        const userId = request.user?.id;
        const userEmail = request.user?.emailAddress;
        const ipAddress = request.ip || request.connection?.remoteAddress;
        const userAgent = request.headers['user-agent'];

        // Get request body (limit size to prevent huge logs)
        let requestBody: string | undefined;
        if (request.body) {
          try {
            const bodyStr = JSON.stringify(request.body);
            requestBody = bodyStr.length > 5000 ? bodyStr.substring(0, 5000) + '...' : bodyStr;
          } catch (e) {
            requestBody = '[Unable to serialize request body]';
          }
        }

        // Get query parameters
        let queryParams: string | undefined;
        if (request.query && Object.keys(request.query).length > 0) {
          try {
            queryParams = JSON.stringify(request.query);
          } catch (e) {
            queryParams = '[Unable to serialize query params]';
          }
        }

        // Log error to database (async, don't wait)
        this.errorLoggingService
          .createErrorLog({
            message: errorMessage,
            stack: errorStack,
            statusCode,
            path,
            method,
            userId,
            userEmail,
            ipAddress,
            userAgent,
            requestBody,
            queryParams,
            errorType,
            severity,
          })
          .catch((logError) => {
            // If logging fails, at least log to console
            console.error('Failed to log error to database:', logError);
          });

        // Re-throw the error so it can be handled by exception filters
        return throwError(() => error);
      }),
    );
  }
}

