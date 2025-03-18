import { Injectable } from '@nestjs/common';
import { Transformer } from './transformer';

@Injectable()
export class ResourceManager {
  collection<T>(data: T[], transformer: Transformer<T>): any {
    return data.map((item) => transformer.transform(item));
  }

  item<T>(data: T, transformer: Transformer<T>): any {
    return transformer.transform(data);
  }
}
