import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateHabitCompletions1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'habit_completions',
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
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['completed', 'skipped'],
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
      'habit_completions',
      new TableUnique({
        name: 'UQ_HABIT_COMPLETIONS_HABIT_ID_DATE',
        columnNames: ['habit_id', 'date'],
      }),
    );

    await queryRunner.createIndex(
      'habit_completions',
      new TableIndex({
        name: 'IDX_HABIT_COMPLETIONS_USER_ID_DATE',
        columnNames: ['user_id', 'date'],
      }),
    );

    await queryRunner.createForeignKey(
      'habit_completions',
      new TableForeignKey({
        name: 'FK_HABIT_COMPLETIONS_HABIT_ID',
        columnNames: ['habit_id'],
        referencedTableName: 'habits',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('habit_completions');
  }
}
