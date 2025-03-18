import { HypermediaLink } from 'src/domain/common/link';
import { httpMethods } from 'src/infrastructure/common/constant';

export class CreateShipmentLink extends HypermediaLink {
    constructor() {
        super('create-shipment', '/shipments', httpMethods.POST);
    }
}

export class ArriveAtStopLink extends HypermediaLink {
    constructor() {
        super('arrive-at-stop', `/shipments/shipment_id/stops/stop_id/arrive`, httpMethods.PATCH);
    }
}

export class PickupAtStopLink extends HypermediaLink {
    constructor() {
        super('pickup-at-stop', `/shipments/shipment_id/stops/stop_id/pickup`, httpMethods.PATCH);
    }
}

export class DeliverAtStopLink extends HypermediaLink {
    constructor() {
        super('deliver-at-stop', `/shipments/shipment_id/stops/stop_id/deliver`, httpMethods.PATCH);
    }
}