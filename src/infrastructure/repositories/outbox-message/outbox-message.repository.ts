import { Injectable } from "@nestjs/common";
import { Event } from "src/domain/common/event";
import { OutboxMessage } from "src/domain/outbox-message/outbox-message.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class OutboxMessageRepository extends Repository<OutboxMessage> {
  constructor(private dataSource: DataSource) {
    super(OutboxMessage, dataSource.createEntityManager());
  }

  createOutboxPayloadFromEvent = (outbox_message: Event): OutboxMessagePayloadType => {
    return {
      message_id: outbox_message.getId(),
      type: outbox_message.getType(),
      properties: outbox_message.getProperties(),
      headers: outbox_message.getHeaders(),
      body: outbox_message.getPayload(),
    };
  }
  async storeOutboxMessage(outbox_message: Event) {
    return await this.save(this.createOutboxPayloadFromEvent(outbox_message));
  }

}