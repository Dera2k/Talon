import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillHabitSchedules1700000000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO habit_schedules (habit_id, days_of_week, created_at, updated_at)
      SELECT id, ARRAY[0,1,2,3,4,5,6], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM habits
      WHERE id NOT IN (SELECT habit_id FROM habit_schedules)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM habit_schedules
      WHERE days_of_week = ARRAY[0,1,2,3,4,5,6]
    `);
  }
}
