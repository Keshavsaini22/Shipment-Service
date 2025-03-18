import { faker } from '@faker-js/faker';
import { Shipment } from 'src/domain/shipment/shipment.entity';
import { StopObjectMother } from './stop.mother';

export class ShipmentObjectMother {
  private stops: StopObjectMother[] = [];

  constructor(
    private id: number = null,
    private uuid: string = null,
    private is_complete: boolean = false,
    private created_at: Date = null,
    private updated_At: Date = null,
  ) {}

  public withStop(mother: StopObjectMother) {
    this.stops.push(mother);
    return this;
  }

  public withStops(mothers: StopObjectMother[]) {
    this.stops = mothers;
    return this;
  }

  public get() {
    const shipment = new Shipment();
    shipment.id = this.id || faker.number.int({ min: 1, max: 1000 });
    shipment.uuid = this.uuid || faker.string.uuid();
    shipment.is_complete = this.is_complete;
    shipment.created_at = this.created_at || faker.date.past();
    shipment.updated_at = this.updated_At || faker.date.recent();

    shipment.stops = this.stops.map((mother) => mother.get());

    return shipment;
  }

  public static uuid() {
    return faker.string.uuid();
  }
}
