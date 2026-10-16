import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { CompletionHistoryQueryDto } from './dto/completion-history-query.dto';
import { CompletionResponseDto } from './dto/completion-response.dto';
import { LogCompletionDto } from './dto/log-completion.dto';
import { CompletionsService } from './completions.service';

@Controller()
export class CompletionsController {
  constructor(private readonly completions: CompletionsService) {}

  @Post('habits/:habitId/completions')
  @HttpCode(HttpStatus.OK)
  async log(
    @CurrentUser() user: AuthenticatedUser,
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @Body() dto: LogCompletionDto,
  ): Promise<CompletionResponseDto> {
    return CompletionResponseDto.from(
      await this.completions.log(user.id, habitId, dto),
    );
  }

  @Delete('habits/:habitId/completions/:date')
  @HttpCode(HttpStatus.NO_CONTENT)
  async undo(
    @CurrentUser() user: AuthenticatedUser,
    @Param('habitId', ParseUUIDPipe) habitId: string,
    @Param('date') date: string,
  ): Promise<void> {
    await this.completions.undo(user.id, habitId, date);
  }

  @Get('completions')
  async history(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: CompletionHistoryQueryDto,
  ) {
    const { items, meta } = await this.completions.history(user.id, query);
    return {
      items: items.map((item) => CompletionResponseDto.from(item)),
      meta,
    };
  }
}
