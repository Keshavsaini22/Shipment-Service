import { Shipment } from 'src/domain/shipment/shipment.entity';
import { Transformer } from './transformer';

export class ShipmentTransformer extends Transformer<Shipment> {
  transform(model: Shipment) {
    return {
      uuid: model.uuid,
      is_complete: model.is_complete,
      created_at: model.created_at,
      updated_at: model.updated_at,
      stops: model.stops.map((stop) => ({
        uuid: stop.uuid,
        sequence: stop.sequence,
        type: stop.type,
        status: stop.status,
        created_at: stop.created_at,
        updated_at: stop.updated_at,
      })),
    };
  }
}
