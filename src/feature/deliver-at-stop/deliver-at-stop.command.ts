export class DeliverAtStopCommand {
    constructor(
        public readonly stop_id: string,
        public readonly shipment_id: string,
    ) { }
}