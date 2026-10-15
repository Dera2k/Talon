"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitResponseDto = void 0;
var HabitResponseDto = /** @class */ (function () {
    function HabitResponseDto() {
    }
    HabitResponseDto.from = function (habit) {
        return {
            id: habit.id,
            name: habit.name,
            description: habit.description,
            color: habit.color,
            frequency: habit.frequency,
            reminderTime: habit.reminderTime,
            archivedAt: habit.archivedAt,
            createdAt: habit.createdAt,
        };
    };
    return HabitResponseDto;
}());
exports.HabitResponseDto = HabitResponseDto;
