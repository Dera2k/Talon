import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateStreaks1700000000011 implements MigrationInterface {
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
            default: '0',
          },
          {
            name: 'longest_streak',
            type: 'int',
            isNullable: false,
            default: '0',
          },
          {
            name: 'last_completed_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'calculated_on',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'streaks',
      new TableUnique({
        name: 'UQ_STREAKS_HABIT_ID',
        columnNames: ['habit_id'],
      }),
    );

    await queryRunner.createIndex(
      'streaks',
      new TableIndex({
        name: 'IDX_STREAKS_USER_ID',
        columnNames: ['user_id'],
      }),
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('streaks');
  }
}
