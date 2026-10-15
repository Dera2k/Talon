import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableUnique,
} from 'typeorm';

export class AlterHabitSchedules1700000000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('habit_schedules', 'type');
    await queryRunner.dropColumn('habit_schedules', 'day_of_month');
    await queryRunner.dropColumn('habit_schedules', 'time_of_day');
    await queryRunner.dropColumn('habit_schedules', 'timezone');
    await queryRunner.dropColumn('habit_schedules', 'reminder_enabled');
    await queryRunner.dropColumn('habit_schedules', 'reminder_minutes_before');

    await queryRunner.createUniqueConstraint(
      'habit_schedules',
      new TableUnique({
        name: 'UQ_HABIT_SCHEDULES_HABIT_ID',
        columnNames: ['habit_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'habit_schedules',
      'UQ_HABIT_SCHEDULES_HABIT_ID',
    );

    await queryRunner.addColumn(
      'habit_schedules',
      new TableColumn({
        name: 'reminder_minutes_before',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'habit_schedules',
      new TableColumn({
        name: 'reminder_enabled',
        type: 'boolean',
        default: true,
      }),
    );
    await queryRunner.addColumn(
      'habit_schedules',
      new TableColumn({
        name: 'timezone',
        type: 'varchar',
        length: '50',
        default: "'UTC'",
      }),
    );
    await queryRunner.addColumn(
      'habit_schedules',
      new TableColumn({
        name: 'time_of_day',
        type: 'time',
        isNullable: false,
      }),
    );
    await queryRunner.addColumn(
      'habit_schedules',
      new TableColumn({
        name: 'day_of_month',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'habit_schedules',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        length: '20',
        isNullable: false,
      }),
    );
  }
}
