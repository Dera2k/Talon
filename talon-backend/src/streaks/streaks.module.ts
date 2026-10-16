import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsModule } from '@habits/habits.module';
import { UsersModule } from '@users/users.module';
import { Streak } from './entities/streak.entity';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Streak]), HabitsModule, UsersModule],
  controllers: [StreaksController],
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
