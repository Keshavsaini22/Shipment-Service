import { Event } from 'src/domain/common/event';

export class ShipmentCompleted extends Event {
  constructor(payload) {
    super(payload);
    this.type = 'shipments-service.shipment_completed';
  }

  getBody() {
    return {
      shipment: this.payload,
    };
  }
}
