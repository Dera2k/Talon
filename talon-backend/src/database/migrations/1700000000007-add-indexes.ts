import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddIndexes1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habits: composite index for dashboard queries
    await queryRunner.createIndex(
      'habits',
      new TableIndex({
        name: 'IDX_HABITS_USER_FREQUENCY_ARCHIVED',
        columnNames: ['user_id', 'frequency', 'is_archived'],
      }),
    );

    // Habit completions: composite for streak calculations
    await queryRunner.createIndex(
      'habit_completions',
      new TableIndex({
        name: 'IDX_HABIT_COMPLETIONS_HABIT_DATE_DESC',
        columnNames: ['habit_id', 'date'],
        isUnique: false,
      }),
    );

    // Habit completions: for analytics calendar heatmap
    await queryRunner.createIndex(
      'habit_completions',
      new TableIndex({
        name: 'IDX_HABIT_COMPLETIONS_USER_DATE_STATUS',
        columnNames: ['user_id', 'date', 'status'],
      }),
    );

    // Streaks: for leaderboard/stats queries
    await queryRunner.createIndex(
      'streaks',
      new TableIndex({
        name: 'IDX_STREAKS_USER_CURRENT_DESC',
        columnNames: ['user_id', 'current_streak'],
      }),
    );

    // Notifications: for unread count
    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_USER_UNREAD_CREATED',
        columnNames: ['user_id', 'status', 'created_at'],
      }),
    );

    // Password reset tokens: cleanup expired tokens
    await queryRunner.createIndex(
      'password_reset_tokens',
      new TableIndex({
        name: 'IDX_PASSWORD_RESET_TOKENS_UNUSED_EXPIRES',
        columnNames: ['used_at', 'expires_at'],
        where: 'used_at IS NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('habits', 'IDX_HABITS_USER_FREQUENCY_ARCHIVED');
    await queryRunner.dropIndex('habit_completions', 'IDX_HABIT_COMPLETIONS_HABIT_DATE_DESC');
    await queryRunner.dropIndex('habit_completions', 'IDX_HABIT_COMPLETIONS_USER_DATE_STATUS');
    await queryRunner.dropIndex('streaks', 'IDX_STREAKS_USER_CURRENT_DESC');
    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_USER_UNREAD_CREATED');
    await queryRunner.dropIndex('password_reset_tokens', 'IDX_PASSWORD_RESET_TOKENS_UNUSED_EXPIRES');
  }
}