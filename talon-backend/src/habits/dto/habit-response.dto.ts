import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { HabitColor } from '@common/enums/habit-color.enum';
import { HabitFrequency } from '@common/enums/habit-frequency.enum';
import { Habit } from '../entities/habit.entity';

export class HabitResponseDto {
  @ApiProperty({ type: String })
  @IsUUID('4')
  id!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  description!: string | null;

  @ApiProperty({ type: String, enum: HabitColor })
  @IsEnum(HabitColor)
  color!: HabitColor;

  @ApiProperty({ type: String, enum: HabitFrequency })
  @IsEnum(HabitFrequency)
  frequency!: HabitFrequency;

  @ApiProperty({ type: String })
  @IsString()
  icon!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  category!: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
  })
  @IsOptional()
  @IsString()
  reminderTime!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  @IsOptional()
  @IsDate()
  archivedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  createdAt!: Date;

  @ApiProperty({ type: [Number], minimum: 0, maximum: 6 })
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weekdays!: number[];

  static from(habit: Habit): HabitResponseDto {
    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      color: habit.color,
      frequency: habit.frequency,
      icon: habit.icon,
      category: habit.category,
      reminderTime: habit.reminderTime,
      archivedAt: habit.archivedAt,
      createdAt: habit.createdAt,
      weekdays: habit.schedule?.daysOfWeek ?? [],
    };
  }
}
