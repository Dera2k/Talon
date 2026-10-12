import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateStreaks1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'streaks',
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
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'current_streak',
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: 'longest_streak',
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: 'last_completion_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'grace_period_used',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'started_at',
            type: 'date',
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
      'streaks',
      new TableForeignKey({
        name: 'FK_STREAKS_HABIT_ID',
        columnNames: ['habit_id'],
        referencedTableName: 'habits',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'streaks',
      new TableForeignKey({
        name: 'FK_STREAKS_USER_ID',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // One streak record per habit
    await queryRunner.createIndex(
      'streaks',
      new TableIndex({
        name: 'IDX_STREAKS_HABIT_ID',
        columnNames: ['habit_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'streaks',
      new TableIndex({
        name: 'IDX_STREAKS_USER_ID',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('streaks');
  }
}