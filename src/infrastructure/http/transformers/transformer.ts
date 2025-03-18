export abstract class Transformer<T> {
    abstract transform(model: T): any;
  }
  