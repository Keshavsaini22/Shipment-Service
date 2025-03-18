import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { PickupAtStopController } from './pickup-at-stop.controller';
import { PickupAtStopHandler } from './pickup-at-stop.handler';
import { PickupAtStopCommand } from './pickup-at-stop.command';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';

@Module({
    imports: [CqrsModule],
    controllers: [PickupAtStopController],
    providers: [ShipmentRepository, OutboxMessageRepository, PickupAtStopHandler, PickupAtStopCommand],
})

export class PickupAtStopModule { }
