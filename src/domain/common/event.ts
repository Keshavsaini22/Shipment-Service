import { v4 } from 'uuid';
export class Event {
  type: string;
  id: string;
  appId: string;
  fired_at: Date;
  payload: any;
  constructor(payload) {
    this.id = v4();
    this.appId = process.env.APP_NAME;
    this.fired_at = new Date();
    this.payload = payload;
  }
  getId() {
    return this.id;
  }
  getType() {
    return this.type;
  }
  getFiredAt() {
    return this.fired_at;
  }
  getBody() {
    return {};
  }
  getHeaders() {
    return {
      type: this.getType(),
      content_type: 'application/json',
    };
  }
  getPayload() {
    return {
      uuid: this.getId(),
      fired_at: this.getFiredAt(),
      ...this.getBody(),
    };
  }
  getProperties() {
    return {
      messageId: this.getId(),
      type: this.getType(),
      appId: this.appId,
      contentType: 'application/json',
      headers: this.getHeaders(),
    };
  }
}
