import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { CreateHabitDto } from './dto/create-habit.dto';
import { HabitQueryDto } from './dto/habit-query.dto';
import { HabitResponseDto } from './dto/habit-response.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habits: HabitsService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateHabitDto,
  ): Promise<HabitResponseDto> {
    return HabitResponseDto.from(await this.habits.create(user.id, dto));
  }

  @Get()
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: HabitQueryDto,
  ) {
    const { items, meta } = await this.habits.list(user.id, query);
    return { items: items.map((item) => HabitResponseDto.from(item)), meta };
  }

  @Get(':id')
  async getOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HabitResponseDto> {
    return HabitResponseDto.from(await this.habits.getOwned(user.id, id));
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateHabitDto,
  ): Promise<HabitResponseDto> {
    return HabitResponseDto.from(await this.habits.update(user.id, id, dto));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async archive(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.habits.archive(user.id, id);
  }
}
