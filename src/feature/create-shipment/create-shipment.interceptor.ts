import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { ArriveAtStopLink, CreateShipmentLink, DeliverAtStopLink, PickupAtStopLink } from 'src/domain/shipment/hypermedia-links/links';
import { AddHypermediaLinks } from 'src/infrastructure/common/add-hypermedia-links';

@Injectable()
export class CreateShipmentInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            catchError((error) => {
                throw error;
            }),
            map((shipment) => {
                const createShipmentLink = new CreateShipmentLink();
                const arriveAtStopLink = new ArriveAtStopLink();
                const pickupAtStopLink = new PickupAtStopLink();
                const deliverShipmentLink = new DeliverAtStopLink();

                const response = new AddHypermediaLinks(shipment);
                response
                    .addLink(createShipmentLink.getKey(), createShipmentLink.getLink())
                    .addLink(arriveAtStopLink.getKey(), arriveAtStopLink.getLink())
                    .addLink(pickupAtStopLink.getKey(), pickupAtStopLink.getLink())
                    .addLink(deliverShipmentLink.getKey(), deliverShipmentLink.getLink())
                    .getData();

                return shipment;
            }),
        );
    }
}
