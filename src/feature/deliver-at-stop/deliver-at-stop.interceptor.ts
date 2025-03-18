import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { ArriveAtStopLink, DeliverAtStopLink, PickupAtStopLink } from 'src/domain/shipment/hypermedia-links/links';
import { AddHypermediaLinks } from 'src/infrastructure/common/add-hypermedia-links';

@Injectable()
export class DeliverAtStopInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            catchError((error) => {
                throw error;
            }),
            map((shipment) => {
                const deliverShipmentLink = new DeliverAtStopLink();
                const arriveAtStopLink = new ArriveAtStopLink();
                const pickupAtStopLink = new PickupAtStopLink();

                const response = new AddHypermediaLinks(shipment);
                response
                    .addLink(arriveAtStopLink.getKey(), arriveAtStopLink.getLink())
                    .addLink(pickupAtStopLink.getKey(), pickupAtStopLink.getLink())
                    .addLink(deliverShipmentLink.getKey(), deliverShipmentLink.getLink())
                    .getData();

                return shipment;
            }),
        );
    }
}
