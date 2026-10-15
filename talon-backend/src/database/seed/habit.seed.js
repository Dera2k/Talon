"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedHabits = seedHabits;
function seedHabits(dataSource) {
    return __awaiter(this, void 0, void 0, function () {
        var userRepository, habitRepository, scheduleRepository, user, existingHabits, exerciseHabit, readHabit, planningHabit, reviewHabit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userRepository = dataSource.getRepository('users');
                    habitRepository = dataSource.getRepository('habits');
                    scheduleRepository = dataSource.getRepository('habit_schedules');
                    return [4 /*yield*/, userRepository.findOne({
                            where: { email: 'demo@talon.app' },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        console.warn('Demo user not found, skipping habit seed.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, habitRepository.count({
                            where: { user_id: user.id },
                        })];
                case 2:
                    existingHabits = _a.sent();
                    if (existingHabits > 0) {
                        console.info('Habits already exist for demo user, skipping habit seed.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, habitRepository.save({
                            user_id: user.id,
                            name: 'Exercise',
                            description: '30 minutes of physical activity',
                            color: '#EF4444',
                            icon: 'dumbbell',
                            frequency: 'daily',
                            target_count: 1,
                        })];
                case 3:
                    exerciseHabit = _a.sent();
                    return [4 /*yield*/, scheduleRepository.save({
                            habit_id: exerciseHabit.id,
                            type: 'daily',
                            time_of_day: '07:00:00',
                            timezone: user.timezone,
                            reminder_enabled: true,
                            reminder_minutes_before: 15,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, habitRepository.save({
                            user_id: user.id,
                            name: 'Read',
                            description: 'Read 20 pages',
                            color: '#3B82F6',
                            icon: 'book',
                            frequency: 'daily',
                            target_count: 1,
                        })];
                case 5:
                    readHabit = _a.sent();
                    return [4 /*yield*/, scheduleRepository.save({
                            habit_id: readHabit.id,
                            type: 'daily',
                            time_of_day: '21:00:00',
                            timezone: user.timezone,
                            reminder_enabled: true,
                            reminder_minutes_before: 30,
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, habitRepository.save({
                            user_id: user.id,
                            name: 'Weekly Planning',
                            description: 'Plan the week ahead',
                            color: '#8B5CF6',
                            icon: 'calendar',
                            frequency: 'weekly',
                            target_count: 1,
                        })];
                case 7:
                    planningHabit = _a.sent();
                    return [4 /*yield*/, scheduleRepository.save({
                            habit_id: planningHabit.id,
                            type: 'weekly',
                            days_of_week: [0], // Sunday
                            time_of_day: '10:00:00',
                            timezone: user.timezone,
                            reminder_enabled: true,
                            reminder_minutes_before: 60,
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, habitRepository.save({
                            user_id: user.id,
                            name: 'Monthly Review',
                            description: 'Review goals and progress',
                            color: '#F59E0B',
                            icon: 'clipboard',
                            frequency: 'monthly',
                            target_count: 1,
                        })];
                case 9:
                    reviewHabit = _a.sent();
                    return [4 /*yield*/, scheduleRepository.save({
                            habit_id: reviewHabit.id,
                            type: 'monthly',
                            day_of_month: 1,
                            time_of_day: '09:00:00',
                            timezone: user.timezone,
                            reminder_enabled: true,
                            reminder_minutes_before: 120,
                        })];
                case 10:
                    _a.sent();
                    console.info('✓ 4 demo habits created with schedules');
                    return [2 /*return*/];
            }
        });
    });
}
