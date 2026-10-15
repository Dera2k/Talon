import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HabitColor } from '@common/enums/habit-color.enum';
import { HabitFrequency } from '@common/enums/habit-frequency.enum';
import { User } from '@users/entities/user.entity';

@Entity('habits')
@Index(['userId', 'archivedAt'])
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description!: string | null;

  @Column({ type: 'enum', enum: HabitColor })
  color!: HabitColor;

  @Column({ type: 'enum', enum: HabitFrequency })
  frequency!: HabitFrequency;

  @Column({ type: 'varchar', length: 5, nullable: true })
  reminderTime!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  archivedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
