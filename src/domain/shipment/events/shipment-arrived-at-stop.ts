import { Event } from 'src/domain/common/event';

export class ShipmentArrivedAtStop extends Event {
  constructor(payload) {
    super(payload);
    this.type = 'shipments-service.arrived_at_stop';
  }

  getBody() {
    return {
      shipment: this.payload,
    };
  }
}
