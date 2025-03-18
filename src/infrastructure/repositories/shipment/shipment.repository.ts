import { Injectable } from '@nestjs/common';
import { Shipment } from 'src/domain/shipment/shipment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ShipmentRepository extends Repository<Shipment> {
    constructor(private dataSource: DataSource) {
        super(Shipment, dataSource.createEntityManager());
    }

    async createShipment(shipment: Shipment): Promise<Shipment> {
        return await this.save(shipment);
    }

    async getShipment(uuid: string): Promise<Shipment | null> {
        return await this.findOne({
            where: { uuid },
            relations: ['stops'],
        });
    }
}
