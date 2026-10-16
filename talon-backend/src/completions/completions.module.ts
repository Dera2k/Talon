import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsModule } from '@habits/habits.module';
import { UsersModule } from '@users/users.module';
import { CompletionsController } from './completions.controller';
import { CompletionsService } from './completions.service';
import { HabitCompletion } from './entities/habit-completion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HabitCompletion]),
    HabitsModule,
    UsersModule,
  ],
  controllers: [CompletionsController],
  providers: [CompletionsService],
  exports: [CompletionsService],
})
export class CompletionsModule {}
