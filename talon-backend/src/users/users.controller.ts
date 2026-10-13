import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  async getMe(
    @CurrentUser() current: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    return UserResponseDto.from(await this.users.getById(current.id));
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() current: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return UserResponseDto.from(await this.users.update(current.id, dto));
  }
}
