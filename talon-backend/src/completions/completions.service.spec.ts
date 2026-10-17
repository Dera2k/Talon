import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheService } from '@cache/cache.service';
import { CompletionStatus } from '@common/enums/completion-status.enum';
import { ErrorCode } from '@common/enums/error-code.enum';
import { HabitsService } from '@habits/habits.service';
import { StreaksService } from '@streaks/streaks.service';
import { UsersService } from '@users/users.service';
import { CompletionsService } from './completions.service';
import { HabitCompletion } from './entities/habit-completion.entity';

const TODAY = '2026-10-16'; // Friday

describe('CompletionsService.log', () => {
  let service: CompletionsService;

  const manager = {
    upsert: jest.fn(),
    delete: jest.fn(),
    findOneByOrFail: jest.fn(),
  };
  const repo = {
    manager: {
      transaction: jest.fn((cb: (m: typeof manager) => unknown) => cb(manager)),
    },
  };
  const habits = { getOwned: jest.fn() };
  const users = { getTodayKey: jest.fn() };
  const streaks = { recalculate: jest.fn() };
  const cache = { invalidateDashboard: jest.fn() };

  const dailyHabit = {
    id: 'h1',
    userId: 'u1',
    archivedAt: null,
    schedule: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    users.getTodayKey.mockResolvedValue(TODAY);
    habits.getOwned.mockResolvedValue(dailyHabit);
    manager.findOneByOrFail.mockResolvedValue({
      id: 'c1',
      habitId: 'h1',
      date: TODAY,
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        CompletionsService,
        { provide: getRepositoryToken(HabitCompletion), useValue: repo },
        { provide: HabitsService, useValue: habits },
        { provide: UsersService, useValue: users },
        { provide: StreaksService, useValue: streaks },
        { provide: CacheService, useValue: cache },
      ],
    }).compile();
    service = moduleRef.get(CompletionsService);
  });

  const log = (dto: { status: CompletionStatus; date?: string }) =>
    service.log('u1', 'h1', dto);

  it('rejects archived habits', async () => {
    habits.getOwned.mockResolvedValue({
      ...dailyHabit,
      archivedAt: new Date(),
    });
    await expect(
      log({ status: CompletionStatus.COMPLETED }),
    ).rejects.toMatchObject({
      code: ErrorCode.BUSINESS_LOGIC_ERROR,
    });
    expect(manager.upsert).not.toHaveBeenCalled();
  });

  it('rejects a habit that is not due on that day', async () => {
    habits.getOwned.mockResolvedValue({
      ...dailyHabit,
      schedule: { daysOfWeek: [1] },
    });
    await expect(
      log({ status: CompletionStatus.COMPLETED }),
    ).rejects.toMatchObject({
      code: ErrorCode.BUSINESS_LOGIC_ERROR,
    });
  });

  it.each([
    ['tomorrow', '2026-10-17'],
    ['8 days back', '2026-10-08'],
    ['an impossible date', '2026-02-31'],
  ])('rejects %s', async (_label, date) => {
    await expect(
      log({ status: CompletionStatus.COMPLETED, date }),
    ).rejects.toMatchObject({
      code: ErrorCode.BUSINESS_LOGIC_ERROR,
    });
  });

  it('accepts exactly 7 days back', async () => {
    await expect(
      log({ status: CompletionStatus.COMPLETED, date: '2026-10-09' }),
    ).resolves.toBeDefined();
  });

  it('upserts, recalculates the streak and invalidates the dashboard', async () => {
    await log({ status: CompletionStatus.SKIPPED });

    expect(manager.upsert).toHaveBeenCalledWith(
      HabitCompletion,
      {
        habitId: 'h1',
        userId: 'u1',
        date: TODAY,
        status: CompletionStatus.SKIPPED,
      },
      ['habitId', 'date'],
    );
    expect(streaks.recalculate).toHaveBeenCalledWith(
      manager,
      dailyHabit,
      TODAY,
    );
    expect(cache.invalidateDashboard).toHaveBeenCalledWith('u1');
  });
});
