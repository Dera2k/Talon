jest.mock('@nestjs/schedule', () => ({
  Cron: () => () => {},
  CronExpression: { EVERY_MINUTE: '* * * * *' },
}));

jest.mock('@nestjs/mapped-types', () => ({
  PartialType: (cls: any) => cls,
  PickType: (cls: any, keys: string[]) => cls,
  OmitType: (cls: any, keys: string[]) => cls,
  IntersectionType: (...classes: any[]) => classes[0],
}));
