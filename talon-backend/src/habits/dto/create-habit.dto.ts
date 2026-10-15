import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { HabitColor } from '@common/enums/habit-color.enum';
import { HabitFrequency } from '@common/enums/habit-frequency.enum';
import { Trim } from '@common/transformers/trim.transformer';

export class CreateHabitDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @IsEnum(HabitColor)
  color!: HabitColor;

  @IsEnum(HabitFrequency)
  frequency!: HabitFrequency;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'reminderTime must be in HH:mm (24h) format',
  })
  reminderTime?: string | null;
}
