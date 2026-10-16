import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationStatus } from '@common/enums/notification-status.enum';
import { NotificationType } from '@common/enums/notification-type.enum';
import { Habit } from '@habits/entities/habit.entity';
import { User } from '@users/entities/user.entity';

@Entity('notifications')
@Index(['userId', 'status', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid', nullable: true })
  habitId!: string | null;

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status!: NotificationStatus;

  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ type: 'varchar', length: 500 })
  message!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Habit, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'habitId' })
  habit!: Habit | null;
}
