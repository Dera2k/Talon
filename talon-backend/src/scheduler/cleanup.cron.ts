import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, LessThan } from 'typeorm';
import { PasswordResetToken } from '@auth/entities/password-reset-token.entity';
import { RefreshToken } from '@auth/entities/refresh-token.entity';
import { Notification } from '@notifications/entities/notification.entity';
import { User } from '@users/entities/user.entity';

const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class CleanupCron {
  private readonly logger = new Logger(CleanupCron.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Cron('0 3 * * *')
  async run(): Promise<void> {
    const now = new Date();
    const cutoff = new Date(now.getTime() - RETENTION_MS);

    await this.safely('expired refresh tokens', () =>
      this.dataSource
        .getRepository(RefreshToken)
        .delete({ expiresAt: LessThan(now) }),
    );
    await this.safely('expired reset tokens', () =>
      this.dataSource
        .getRepository(PasswordResetToken)
        .delete({ expiresAt: LessThan(now) }),
    );
    await this.safely('old notifications', () =>
      this.dataSource
        .getRepository(Notification)
        .delete({ createdAt: LessThan(cutoff) }),
    );
    await this.safely('soft-deleted users', () =>
      this.dataSource
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('deleted_at < :cutoff', { cutoff })
        .execute(),
    );
  }

  private async safely(
    label: string,
    task: () => Promise<{ affected?: number | null }>,
  ): Promise<void> {
    try {
      const { affected } = await task();
      this.logger.log(`Cleaned ${affected ?? 0} ${label}`);
    } catch (error) {
      this.logger.error(`Cleanup failed for ${label}`, String(error));
    }
  }
}
