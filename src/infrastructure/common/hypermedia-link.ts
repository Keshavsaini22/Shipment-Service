import { Injectable } from '@nestjs/common';
import { HALLink } from './HAL.interface';

@Injectable()
export class HypermediaLinks<T> {
  private data: T;
  constructor(data: T) {
    this.data = data;
  }

  public getData() {
    return this.data;
  }

  public addLink(rel: string, HALLinkObject: HALLink) {
    this.data['_links'] = {
      ...this.data['_links'],
      [rel]: HALLinkObject,
    };

    return this;
  }

  public addEmbedded({ field, rel }: { field: string; rel: string }) {

    this.data['_embedded'] = {
      ...this.data['_embedded'],
      [rel]: this.data[field],
    };
    delete this.data[field];
    return this;
  }
}
