import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { ArriveAtStopController } from './arrive-at-stop.controller';
import { ArriveAtStopCommand } from './arrive-at-stop.command';
import { ArriveAtStopHandler } from './arrive-at-stop.handler';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';


@Module({
    imports: [CqrsModule],
    controllers: [ArriveAtStopController],
    providers: [ShipmentRepository, OutboxMessageRepository, ArriveAtStopCommand, ArriveAtStopHandler, ArriveAtStopCommand],
})

export class ArriveAtStopModule { }
