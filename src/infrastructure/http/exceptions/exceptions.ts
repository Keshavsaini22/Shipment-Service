import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class DtoValidation extends BadRequestException {
  constructor(errors: ValidationError[]) {
    const messages = errors.map((error) => {
      return {
        name: error.property,
        message: Object.values(error.constraints).join(', '),
      };
    });
    super(messages, 'Validation failed');
  }
}
