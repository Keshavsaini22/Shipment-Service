type OutboxMessagePayloadType = {
  message_id: string;
  type: string;
  properties: OutboxMessagePropertiesType;
  headers: OutboxMessageHeadersType;
  body: OutboxMessageBodyType;
};

type OutboxMessageResponseType = {
  id: number;
  message_id: string;
  type: string;
  properties: OutboxMessagePropertiesType;
  headers: OutboxMessageHeadersType;
  body: OutboxMessageBodyType;
  sent_at?: Date | null;
  status: 'PENDING' | 'SENT';
};

type OutboxMessageHeadersType = {
  type: string;
  content_type: string;
};

type OutboxMessagePropertiesType = {
  messageId: string;
  type: string;
  appId: string;
  contentType: string;
  headers: OutboxMessageHeadersType;
};

type OutboxMessageBodyType = {
  [key: string]: any;
};
