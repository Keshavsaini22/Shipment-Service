export class HypermediaLink {
  constructor(
    public readonly key: string,
    public readonly href: string,
    public readonly method: string,
  ) {}

  getLink() {
    return {
      href: this.href,
      method: this.method,
    };
  }

  getKey() {
    return this.key;
  }
}
