import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shipment } from '../shipment/shipment.entity';
import { StopStatus } from './enums/stop-status.enum';
import { StopType } from './enums/stop-type';
import {
  StopAlreadyArrivedConflict,
  StopAlreadyDepartedConflict,
  StopAlreadyInTransitConflict,
} from './exceptions/exceptions';

@Entity('stop')
export class Stop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', generated: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'int' })
  sequence: number;

  @Column({
    type: 'enum',
    enum: StopType,
  })
  type: StopType;

  @Column({
    type: 'enum',
    enum: StopStatus,
    default: StopStatus.IN_TRANSIT,
  })
  status: StopStatus;

  @ManyToOne(() => Shipment, (shipment) => shipment.stops, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  public arrive(): void {
    if (this.status !== StopStatus.IN_TRANSIT) {
      throw new StopAlreadyArrivedConflict();
    }

    this.status = StopStatus.ARRIVED;
  }

  public depart(): void {
    if (this.status === StopStatus.DEPARTED) {
      throw new StopAlreadyDepartedConflict();
    }

    if (this.status === StopStatus.IN_TRANSIT) {
      throw new StopAlreadyInTransitConflict();
    }

    this.status = StopStatus.DEPARTED;
  }
}
