import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habit } from '@habits/entities/habit.entity';

@Entity('habit_schedules')
export class HabitSchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  habitId!: string;

  // 0 = Sunday ... 6 = Saturday (matches JS Date#getUTCDay)
  @Column({ type: 'smallint', array: true })
  daysOfWeek!: number[];

  @OneToOne(() => Habit, (habit) => habit.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit!: Habit;
}
