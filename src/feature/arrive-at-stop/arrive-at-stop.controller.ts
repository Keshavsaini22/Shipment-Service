import { Controller, Param, Patch, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ArriveAtStopCommand } from './arrive-at-stop.command';
import { ArriveAtStopInterceptor } from './arrive-at-stop.interceptor';


@Controller('shipments')
export class ArriveAtStopController {
    constructor(private commandBus: CommandBus) { }

    @Patch('/:shipment_id/stops/:stop_id/arrive')
    @UseInterceptors(new ArriveAtStopInterceptor())
    async arriveAtStop(
        @Param('shipment_id') shipment_id: string,
        @Param('stop_id') stop_id: string) {

        const command = new ArriveAtStopCommand(stop_id, shipment_id);
        await this.commandBus.execute(command);

        return { message: 'Arrived at stop successfully' };
    }
}