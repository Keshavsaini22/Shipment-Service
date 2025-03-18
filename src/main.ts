import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DtoValidation } from './infrastructure/http/exceptions/exceptions';
import { AllExceptionsFilter } from './infrastructure/http/exceptions/all-expception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
                                                                                           
  const port = configService.get<number>('APP_PORT');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new DtoValidation(errors);
      },
    }),
  ); 
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(port);
}

bootstrap();
