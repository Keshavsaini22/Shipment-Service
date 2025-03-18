import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutBoxStatus } from './enums/outbox-status.enum';

@Entity('outbox_message')
export class OutboxMessage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid', unique: true })
  message_id: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'json' })
  headers: any;

  @Column({ type: 'json' })
  properties: any;

  @Column({ type: 'json' })
  body: any;

  @Column({ type: 'enum', enum: OutBoxStatus, default: OutBoxStatus.PENDING })
  status: OutBoxStatus;

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  public markAsSent(): void {
    if (this.status === OutBoxStatus.SENT) {
      throw new Error('Message is already marked as sent.');
    }

    this.status = OutBoxStatus.SENT;
    this.sent_at = new Date();
  }

  getProperties(): any {
    return {
      ...this.properties,
      headers: this.headers,
    };
  }

  getBody(): any {
    return this.body;
  }
}
