import { MapperRegistry } from 'http-problem-details-mapper';
import {
  DtoValidationExceptionMapper,
  ShipmentNotFoundMapper,
  StopAlreadyArrivedConflictMapper,
  StopAlreadyDepartedConflictMapper,
  StopAlreadyInTransitConflictMapper,
  StopNotFoundMapper,
  StopSequenceConflictMapper,
  StopTypeDeliveryConflictMapper,
  StopTypePickupConflictMapper,
  ValidationPipeExceptionMapper,
} from './mappers';

export class MapperRegistryFactory {
  static create(): MapperRegistry {
    return new MapperRegistry({ useDefaultErrorMapper: false })
      .registerMapper(new DtoValidationExceptionMapper())
      .registerMapper(new ValidationPipeExceptionMapper())
      .registerMapper(new StopNotFoundMapper())
      .registerMapper(new ShipmentNotFoundMapper())
      .registerMapper(new StopAlreadyArrivedConflictMapper())
      .registerMapper(new StopAlreadyDepartedConflictMapper())
      .registerMapper(new StopAlreadyInTransitConflictMapper())
      .registerMapper(new StopSequenceConflictMapper())
      .registerMapper(new StopTypeDeliveryConflictMapper())
      .registerMapper(new StopTypePickupConflictMapper());
  }
}
