import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { ShipmentCompleted } from "src/domain/shipment/events/shipment-completed";
import { ShipmentPickedUpFromStop } from "src/domain/shipment/events/shipment-picked-up-from-stop";
import { ShipmentNotFound } from "src/domain/shipment/exceptions/exceptions";
import { OutboxMessageRepository } from "src/infrastructure/repositories/outbox-message/outbox-message.repository";
import { ShipmentRepository } from "src/infrastructure/repositories/shipment/shipment.repository";
import { Transactional } from "typeorm-transactional";
import { PickupAtStopCommand } from "./pickup-at-stop.command";

@CommandHandler(PickupAtStopCommand)
export class PickupAtStopHandler
    implements ICommandHandler<PickupAtStopCommand> {
    constructor(
        @InjectRepository(ShipmentRepository)
        private readonly shipmentRepository: ShipmentRepository,

        @InjectRepository(OutboxMessageRepository)
        private outboxMessageRepository: OutboxMessageRepository,
    ) { }

    @Transactional()
    async execute(command: PickupAtStopCommand) {
        const { stop_id, shipment_id } = command;

        const shipment = await this.shipmentRepository.getShipment(shipment_id);

        if (!shipment) {
            throw new ShipmentNotFound();
        }

        shipment.pickup(stop_id);
        await this.shipmentRepository.save(shipment);

        await this.outboxMessageRepository
            .storeOutboxMessage(new ShipmentPickedUpFromStop({ shipment_id, stop_id }));

        // Check if shipment is complete
        if (shipment.isComplete()) {
            shipment.markAsComplete();
            await this.shipmentRepository.save(shipment);

            await this.outboxMessageRepository
                .storeOutboxMessage(new ShipmentCompleted({ shipment_id, stop_id }));
        }
    }
}
