import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CompletionStatus } from '@common/enums/completion-status.enum';
import { Habit } from '@habits/entities/habit.entity';

@Entity('habit_completions')
@Unique(['habitId', 'date'])
@Index(['userId', 'date'])
export class HabitCompletion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  habitId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'enum', enum: CompletionStatus })
  status!: CompletionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => Habit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit!: Habit;
}
