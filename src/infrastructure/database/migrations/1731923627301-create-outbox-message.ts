import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOutboxMessage1731923627301 implements MigrationInterface {
  name = 'CreateOutboxMessage1731923627301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."outbox_message_status_enum" AS ENUM('SENT', 'PENDING');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'outbox_message',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'message_id',
            type: 'uuid',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'headers',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'properties',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'body',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'status',
            type: '"public"."outbox_message_status_enum"',
            default: `'PENDING'`,
            isNullable: false,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'TIMESTAMP',
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
    await queryRunner.dropTable('outbox_message');
    await queryRunner.query(`DROP TYPE "public"."outbox_message_status_enum"`);
  }
}

