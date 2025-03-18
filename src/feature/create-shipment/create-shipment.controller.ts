import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateShipmentDto } from './create-shipment.dto';
import { CreateShipmentCommand } from './create-shipment.command';
import { CreateShipmentInterceptor } from './create-shipment.interceptor';
import { ResourceManager } from 'src/infrastructure/http/transformers/resource-manager';
import { ShipmentTransformer } from 'src/infrastructure/http/transformers/shipment.transformer';
import { Shipment } from 'src/domain/shipment/shipment.entity';

@Controller('shipments')
export class CreateShipmentController {
  constructor(
    private commandBus: CommandBus,
    private readonly resourceManager: ResourceManager,
  ) {}

  @Post('/')
  @UseInterceptors(new CreateShipmentInterceptor())
  async createShipment(@Body() body: CreateShipmentDto) {
    const { stops } = body;
    const command = new CreateShipmentCommand(stops);

    const shipment = await this.commandBus.execute(command);

    return await this.resourceManager.item<Shipment>(
      shipment,
      new ShipmentTransformer(),
    );
  }
}
