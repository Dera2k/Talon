import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HabitColor } from '@common/enums/habit-color.enum';
import { HabitFrequency } from '@common/enums/habit-frequency.enum';
import { Trim } from '@common/transformers/trim.transformer';

export class CreateHabitDto {
  @ApiProperty()
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @ApiProperty({ enum: HabitColor })
  @IsEnum(HabitColor)
  color!: HabitColor;

  @ApiProperty({ enum: HabitFrequency })
  @IsEnum(HabitFrequency)
  frequency!: HabitFrequency;

  @ApiPropertyOptional({ pattern: '^[a-z][a-z0-9-]{0,31}$' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z][a-z0-9-]{0,31}$/, {
    message: 'icon must be a lowercase identifier of at most 32 characters',
  })
  icon?: string;

  @ApiPropertyOptional({ type: String, maxLength: 50 })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || null : value,
  )
  @IsString()
  @MaxLength(50)
  category?: string | null;

  @ApiPropertyOptional({ type: [Number], minimum: 0, maximum: 6 })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weekdays?: number[];
}
