import { Event } from "src/domain/common/event";

export class ShipmentPickedUpFromStop extends Event {
    constructor(payload) {
        super(payload);
        this.type = "shipments-service.picked_up_from_stop";
    }

    getBody() {
        return {
            shipment: this.payload
        };
    }
}