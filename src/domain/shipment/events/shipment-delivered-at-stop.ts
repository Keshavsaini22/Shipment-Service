import { Event } from "src/domain/common/event";

export class ShipmentDeliveredAtStop extends Event {
    constructor(payload) {
        super(payload);
        this.type = "shipments-service.delivered_at_stop";
    }

    getBody() {
        return {
            shipment: this.payload
        };
    }
}