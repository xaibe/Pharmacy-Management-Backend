import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

let app: any;

async function bootstrap() {
  if (!app) {
    try {
      console.log('Initializing NestJS application...');
      app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
      });

      // Enable CORS
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:3002',
        process.env.FRONTEND_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
      ].filter(Boolean);

      app.enableCors({
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
          
          // Check if origin is in allowed list
          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            // Allow Vercel preview deployments
            if (origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
              callback(null, true);
            } else {
              console.log('CORS blocked origin:', origin);
              callback(new Error('Not allowed by CORS'));
            }
          }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'Content-Disposition', 'Content-Type'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200,
      });

      // Global validation pipe
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );

      // Global exception filter
      app.useGlobalFilters(new HttpExceptionFilter());

      // Swagger configuration
      const config = new DocumentBuilder()
        .setTitle('Pharmacy Management System API')
        .setDescription('The Pharmacy Management System API documentation')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
          },
          'JWT-auth',
        )
        .build();

      const document = SwaggerModule.createDocument(app, config);

      // Custom Swagger setup for serverless environment
      SwaggerModule.setup('api', app, document, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Pharmacy Management System API Documentation',
        swaggerOptions: {
          docExpansion: 'list',
          filter: true,
          showRequestHeaders: true,
        },
      });

      await app.init();
      console.log('NestJS application initialized successfully');
    } catch (error) {
      console.error('Error initializing NestJS application:', error);
      throw error;
    }
  }
  return app;
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    console.log('Handling request:', req.method, req.url);
    const app = await bootstrap();
    const expressInstance = app.getHttpAdapter().getInstance();
    return expressInstance(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    // Return a proper error response
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong',
      timestamp: new Date().toISOString(),
    });
  }
}

