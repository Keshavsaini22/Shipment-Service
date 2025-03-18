import { Controller, Param, Patch, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeliverAtStopCommand } from './deliver-at-stop.command';
import { DeliverAtStopInterceptor } from './deliver-at-stop.interceptor';


@Controller('shipments')
export class DeliverAtStopController {
    constructor(private commandBus: CommandBus) { }

    @Patch('/:shipment_id/stops/:stop_id/deliver')
    @UseInterceptors(new DeliverAtStopInterceptor())

    async deliverAtStop(
        @Param('shipment_id') shipment_id: string,
        @Param('stop_id') stop_id: string) {

        const command = new DeliverAtStopCommand(stop_id, shipment_id);
        await this.commandBus.execute(command);

        return { message: 'Shipment delivered at stop successfully' };
    }
}