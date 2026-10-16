import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { StreakResponseDto } from './dto/streak-response.dto';
import { StreaksService } from './streaks.service';

@Controller()
export class StreaksController {
  constructor(private readonly streaks: StreaksService) {}

  @Get('streaks')
  async list(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<StreakResponseDto[]> {
    const streaks = await this.streaks.listForUser(user.id);
    return streaks.map((streak) => StreakResponseDto.from(streak));
  }

  @Get('habits/:habitId/streak')
  async getForHabit(
    @CurrentUser() user: AuthenticatedUser,
    @Param('habitId', ParseUUIDPipe) habitId: string,
  ): Promise<StreakResponseDto> {
    return StreakResponseDto.from(
      await this.streaks.getForHabit(user.id, habitId),
    );
  }
}
