export class EmbedData {
  constructor(public data: any) {}

  getData() {
    return {
      data: this.data,
    };
  }
}
