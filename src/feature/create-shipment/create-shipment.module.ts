import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { CreateShipmentController } from './create-shipment.controller';
import { CreateShipmentHandler } from './create-shipment.handler';
import { CreateShipmentCommand } from './create-shipment.command';
import { ResourceManager } from 'src/infrastructure/http/transformers/resource-manager';

@Module({
  imports: [CqrsModule],
  controllers: [CreateShipmentController],
  providers: [ShipmentRepository, CreateShipmentHandler, CreateShipmentCommand,ResourceManager],
})

export class CreateShipmentModule { }
