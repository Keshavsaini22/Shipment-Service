export class ShipmentNotFound extends Error {
  constructor() {
    super('Shipment not found.');
  }
}

export class StopNotFound extends Error {
  constructor() {
    super('Stop not found.');
  }
}

export class StopSequenceConflict extends Error {
  constructor() {
    super('Previous stops have not departed yet.');
  }
}

export class StopTypeDeliveryConflict extends Error {
  constructor() {
    super('Stop is not a delivery stop');
  }
}

export class StopTypePickupConflict extends Error {
  constructor() {
    super('Stop is not a pickup stop');
  }
}

export class StopAlreadyArrivedConflict extends Error {
    constructor() {
        super('Stop has already arrived.')
    }
}

export class StopAlreadyDepartedConflict extends Error {
    constructor() {
        super('Stop has already departed.')
    }
}

export class StopAlreadyInTransitConflict extends Error {
    constructor() {
        super(`Stop hasn't arrived yet.`)
    }
}