import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateShipment1731923627299 implements MigrationInterface {
  name = 'CreateShipment1731923627299';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shipment',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'uuid',
            type: 'uuid',
            isUnique: true,
            default: 'uuid_generate_v4()',
            isNullable: false,
          },
          {
            name: 'is_complete',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shipment');
  }
}