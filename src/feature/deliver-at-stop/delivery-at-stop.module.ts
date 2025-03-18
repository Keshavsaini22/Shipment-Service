import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { DeliverAtStopController } from './deliver-at-stop.controller';
import { DeliverAtStopHandler } from './deliver-at-stop.handler';
import { DeliverAtStopCommand } from './deliver-at-stop.command';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';


@Module({
    imports: [CqrsModule],
    controllers: [DeliverAtStopController],
    providers: [ShipmentRepository, OutboxMessageRepository, DeliverAtStopHandler, DeliverAtStopCommand],
})

export class DeliverAtStopModule { }
