import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  StopNotFound,
  StopSequenceConflict,
  StopTypeDeliveryConflict,
  StopTypePickupConflict,
} from './exceptions/exceptions';
import { Stop } from './stop.entity';
import { StopStatus } from './enums/stop-status.enum';
import { StopType } from './enums/stop-type';

@Entity('shipment')
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', generated: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'boolean', default: false })
  is_complete: boolean;

  @OneToMany(() => Stop, (stop) => stop.shipment, {
    cascade: true,
    eager: true,
  })
  stops: Stop[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  public markAsComplete() {
    this.is_complete = true;
  }

  public isComplete() {
    return this.stops.every((stop) => stop.status === StopStatus.DEPARTED);
  }

  public arrive(stopId: string): void {
    const currentStop = this.findStopById(stopId);

    // Ensure all previous stops have been departed before arriving at this stop
    const previousStopsNotDeparted = this.stops.some(
      (stop) =>
        stop.sequence < currentStop.sequence &&
        stop.status !== StopStatus.DEPARTED,
    );

    if (previousStopsNotDeparted) {
      throw new StopSequenceConflict();
    }

    currentStop.arrive();
  }

  public pickup(stopId: string): void {
    const currentStop = this.findStopById(stopId);

    if (currentStop.type !== StopType.PICKUP) {
      throw new StopTypePickupConflict();
    }

    currentStop.depart();
  }

  public deliver(stopId: string): void {
    const currentStop = this.findStopById(stopId);

    if (currentStop.type !== StopType.DELIVERY) {
      throw new StopTypeDeliveryConflict();
    }

    currentStop.depart();
  }

  public findStopById(stopId: string): Stop {
    const stop = this.stops.find((stop) => stop.uuid === stopId);
    if (!stop) {
      throw new StopNotFound();
    }
    return stop;
  }
}
