import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey, TableUnique } from 'typeorm';

export class CreateHabitCompletions1700000000003 implements MigrationInterface {
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
            name: 'completed_at',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            isNullable: false,
            default: "'completed'",
          },
          {
            name: 'count',
            type: 'int',
            isNullable: false,
            default: 1,
          },
          {
            name: 'notes',
            type: 'text',
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
      'habit_completions',
      new TableForeignKey({
        name: 'FK_HABIT_COMPLETIONS_HABIT_ID',
        columnNames: ['habit_id'],
        referencedTableName: 'habits',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'habit_completions',
      new TableForeignKey({
        name: 'FK_HABIT_COMPLETIONS_USER_ID',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // One completion per habit per day (enforce uniqueness)
    await queryRunner.createUniqueConstraint(
      'habit_completions',
      new TableUnique({
        name: 'UQ_HABIT_COMPLETIONS_HABIT_DATE',
        columnNames: ['habit_id', 'date'],
      }),
    );

    await queryRunner.createIndex(
      'habit_completions',
      new TableIndex({
        name: 'IDX_HABIT_COMPLETIONS_HABIT_ID',
        columnNames: ['habit_id'],
      }),
    );

    await queryRunner.createIndex(
      'habit_completions',
      new TableIndex({
        name: 'IDX_HABIT_COMPLETIONS_USER_DATE',
        columnNames: ['user_id', 'date'],
      }),
    );

    await queryRunner.createIndex(
      'habit_completions',
      new TableIndex({
        name: 'IDX_HABIT_COMPLETIONS_DATE',
        columnNames: ['date'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('habit_completions');
  }
}