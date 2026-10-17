import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { MarkReadDto } from './dto/mark-read.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationsService } from './notifications.service';

@ApiExtraModels(NotificationResponseDto, MarkReadDto)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  @ApiResponse({ type: NotificationResponseDto })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: NotificationQueryDto,
  ) {
    const { items, meta } = await this.notifications.list(user.id, query);
    return {
      items: items.map((item) => NotificationResponseDto.from(item)),
      meta,
    };
  }

  @Get('unread-count')
  async unreadCount(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ count: number }> {
    return { count: await this.notifications.countUnread(user.id) };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('read')
  async markRead(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: MarkReadDto,
  ): Promise<void> {
    await this.notifications.markRead(user.id, dto.ids);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('read-all')
  async markAllRead(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.notifications.markAllRead(user.id);
  }
}
