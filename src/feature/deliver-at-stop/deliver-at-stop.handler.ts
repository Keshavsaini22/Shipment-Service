import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentCompleted } from 'src/domain/shipment/events/shipment-completed';
import { ShipmentDeliveredAtStop } from 'src/domain/shipment/events/shipment-delivered-at-stop';
import { ShipmentNotFound } from 'src/domain/shipment/exceptions/exceptions';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { Transactional } from 'typeorm-transactional';
import { DeliverAtStopCommand } from './deliver-at-stop.command';

@CommandHandler(DeliverAtStopCommand)
export class DeliverAtStopHandler
  implements ICommandHandler<DeliverAtStopCommand>
{
  constructor(
    @InjectRepository(ShipmentRepository)
    private readonly shipmentRepository: ShipmentRepository,

    @InjectRepository(OutboxMessageRepository)
    private outboxMessageRepository: OutboxMessageRepository,
  ) {}

  @Transactional()
  async execute(command: DeliverAtStopCommand) {
    const { stop_id, shipment_id } = command;

    const shipment = await this.shipmentRepository.getShipment(shipment_id);

    if (!shipment) {
      throw new ShipmentNotFound();
    }

    shipment.deliver(stop_id);
    await this.shipmentRepository.save(shipment);

    await this.outboxMessageRepository.storeOutboxMessage(
      new ShipmentDeliveredAtStop({ shipment_id, stop_id }),
    );

    //Check if shipment is complete or not
    if (shipment.isComplete()) {
      shipment.markAsComplete();
      await this.shipmentRepository.save(shipment);

      await this.outboxMessageRepository.storeOutboxMessage(
        new ShipmentCompleted({ shipment_id }),
      );
    }
  }
}
