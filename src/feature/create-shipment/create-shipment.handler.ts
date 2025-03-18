import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateShipmentCommand } from './create-shipment.command';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from 'src/domain/shipment/shipment.entity';
import { Stop } from 'src/domain/shipment/stop.entity';

@CommandHandler(CreateShipmentCommand)
export class CreateShipmentHandler
  implements ICommandHandler<CreateShipmentCommand>
{
  constructor(
    @InjectRepository(ShipmentRepository)
    private readonly repository: ShipmentRepository,
  ) {}

  async execute(command: CreateShipmentCommand) {
    const { stops } = command;
    let shipment = new Shipment();

    // Create Stop entities
    shipment.stops = stops.map((stopData) => {
      const stop = new Stop();
      stop.sequence = stopData.sequence;
      stop.type = stopData.type as any;
      stop.shipment = shipment;
      return stop;
    });

    // Save the shipment with stops
    return await this.repository.createShipment(shipment);
  }
}
