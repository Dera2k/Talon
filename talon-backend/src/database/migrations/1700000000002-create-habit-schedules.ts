import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateHabitSchedules1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'habit_schedules',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'habit_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'days_of_week',
            type: 'int',
            array: true,
            isNullable: true,
          },
          {
            name: 'day_of_month',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'time_of_day',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '50',
            isNullable: false,
            default: "'UTC'",
          },
          {
            name: 'reminder_enabled',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'reminder_minutes_before',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'habit_schedules',
      new TableForeignKey({
        name: 'FK_HABIT_SCHEDULES_HABIT_ID',
        columnNames: ['habit_id'],
        referencedTableName: 'habits',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'habit_schedules',
      new TableIndex({
        name: 'IDX_HABIT_SCHEDULES_HABIT_ID',
        columnNames: ['habit_id'],
      }),
    );

    await queryRunner.createIndex(
      'habit_schedules',
      new TableIndex({
        name: 'IDX_HABIT_SCHEDULES_TYPE',
        columnNames: ['type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('habit_schedules');
  }
}