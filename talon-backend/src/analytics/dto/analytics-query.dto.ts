import { IsEnum, Matches } from 'class-validator';

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

export enum StatsInterval {
  WEEK = 'week',
  MONTH = 'month',
  WEEKDAY = 'weekday',
}

export class AnalyticsRangeDto {
  @Matches(DATE_KEY, { message: 'from must be YYYY-MM-DD' })
  from!: string;

  @Matches(DATE_KEY, { message: 'to must be YYYY-MM-DD' })
  to!: string;
}

export class StatsQueryDto extends AnalyticsRangeDto {
  @IsEnum(StatsInterval)
  interval!: StatsInterval;
}
