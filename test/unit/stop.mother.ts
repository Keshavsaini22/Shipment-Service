import { faker } from '@faker-js/faker';
import { StopStatus } from 'src/domain/shipment/enums/stop-status.enum';
import { StopType } from 'src/domain/shipment/enums/stop-type';
import { Stop } from 'src/domain/shipment/stop.entity';

export class StopObjectMother {
  constructor(
    private id: number = null,
    private uuid: string = null,
    private sequence: number = null,
    private status: StopStatus = null,
    private type: StopType = null, 
    private created_at: Date = null,
    private updated_at: Date = null,
  ) {}

  public get() {
    const stop = new Stop();
    stop.id = this.id || faker.number.int({ min: 1, max: 1000 });
    stop.uuid = this.uuid || faker.string.uuid();
    stop.sequence = this.sequence || faker.number.int({ min: 1, max: 10 });
    stop.status =
      this.status || faker.helpers.arrayElement(Object.values(StopStatus));
    stop.type =
      this.type || faker.helpers.arrayElement(Object.values(StopType));
    stop.created_at = this.created_at || faker.date.past();
    stop.updated_at = this.updated_at || faker.date.recent();

    return stop;
  }

  public withSequenceNumber(number) {
    this.sequence = number;
    return this;
  }

  public withInTransitStatus() {
    this.status = StopStatus.IN_TRANSIT;
    return this;
  }

  public withArriveStatus() {
    this.status = StopStatus.ARRIVED;
    return this;
  }

  public withDepartStatus() {
    this.status = StopStatus.DEPARTED;
    return this;
  }

  public withTypeDelivery() {
    this.type = StopType.DELIVERY;
    return this;
  }

  public withTypePickUp() {
    this.type = StopType.PICKUP;
    return this;
  }

  public static uuid() {
    return faker.string.uuid();
  }
}
