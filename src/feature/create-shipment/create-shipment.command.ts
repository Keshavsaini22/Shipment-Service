export class CreateShipmentCommand {
    constructor(
        public readonly stops: { sequence: number; type: string }[],
    ) { }
}