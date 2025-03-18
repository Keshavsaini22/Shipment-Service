import { BadRequestException, HttpStatus } from '@nestjs/common';
import {
  ProblemDocument,
  ProblemDocumentExtension,
} from 'http-problem-details';
import { ErrorMapper } from 'http-problem-details-mapper';
import { DtoValidation } from './exceptions';
import {
  ShipmentNotFound,
  StopAlreadyArrivedConflict,
  StopAlreadyDepartedConflict,
  StopAlreadyInTransitConflict,
  StopNotFound,
  StopSequenceConflict,
  StopTypeDeliveryConflict,
  StopTypePickupConflict,
} from 'src/domain/shipment/exceptions/exceptions';

class ConflictMapper {
  static mapError(error: Error): ProblemDocument {
    return new ProblemDocument({
      title: 'Conflict',
      detail: error.message,
      status: HttpStatus.CONFLICT,
    });
  }
}

class NotFoundMapper {
  static mapError(error: Error): ProblemDocument {
    return new ProblemDocument({
      title: 'Not Found',
      detail: error.message,
      status: HttpStatus.NOT_FOUND,
    });
  }
}

export class DtoValidationExceptionMapper extends ErrorMapper {
  constructor() {
    super(DtoValidation);
  }

  mapError(error: Error): ProblemDocument {
    const response =
      error instanceof DtoValidation ? error.getResponse() : null;
    const extension = new ProblemDocumentExtension({
      invalid_params:
        response && typeof response === 'object'
          ? (response as any)?.message
          : null,
    });
    return new ProblemDocument(
      {
        title: 'Bad Request',
        detail: error.message,
        status: HttpStatus.BAD_REQUEST,
      },
      extension,
    );
  }
}

export class ValidationPipeExceptionMapper extends ErrorMapper {
  constructor() {
    super(BadRequestException);
  }

  mapError(error: Error): ProblemDocument {
    return new ProblemDocument({
      title: 'Bad Request',
      detail: error.message,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}

export class StopNotFoundMapper extends ErrorMapper {
  constructor() {
    super(StopNotFound);
  }

  mapError(error: Error): ProblemDocument {
    return NotFoundMapper.mapError(error);
  }
}

export class ShipmentNotFoundMapper extends ErrorMapper {
  constructor() {
    super(ShipmentNotFound);
  }

  mapError(error: Error): ProblemDocument {
    return NotFoundMapper.mapError(error);
  }
}

export class StopAlreadyArrivedConflictMapper extends ErrorMapper {
  constructor() {
    super(StopAlreadyArrivedConflict);
  }

  mapError(error: Error): ProblemDocument {
    return ConflictMapper.mapError(error);
  }
}

export class StopAlreadyDepartedConflictMapper extends ErrorMapper {
  constructor() {
    super(StopAlreadyDepartedConflict);
  }

  mapError(error: Error): ProblemDocument {
    return ConflictMapper.mapError(error);
  }
}

export class StopAlreadyInTransitConflictMapper extends ErrorMapper {
  constructor() {
    super(StopAlreadyInTransitConflict);
  }

  mapError(error: Error): ProblemDocument {
    return ConflictMapper.mapError(error);
  }
}

export class StopSequenceConflictMapper extends ErrorMapper {
  constructor() {
    super(StopSequenceConflict);
  }

  mapError(error: Error): ProblemDocument {
    return ConflictMapper.mapError(error);
  }
}

export class StopTypeDeliveryConflictMapper extends ErrorMapper {
  constructor() {
    super(StopTypeDeliveryConflict);
  }

  mapError(error: Error): ProblemDocument {
    return ConflictMapper.mapError(error);
  }
}

export class StopTypePickupConflictMapper extends ErrorMapper {
  constructor() {
    super(StopTypePickupConflict);
  }

  mapError(error: Error): ProblemDocument {
    return ConflictMapper.mapError(error);
  }
}
