"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
exports.seedNotifications = seedNotifications;
function seedNotifications(dataSource) {
    return __awaiter(this, void 0, void 0, function () {
        var userRepository, habitRepository, notificationRepository, user, habits, existing, exerciseHabit, readHabit;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userRepository = dataSource.getRepository('users');
                    habitRepository = dataSource.getRepository('habits');
                    notificationRepository = dataSource.getRepository('notifications');
                    return [4 /*yield*/, userRepository.findOne({
                            where: { email: 'demo@talon.app' },
                        })];
                case 1:
                    user = _c.sent();
                    if (!user) {
                        console.warn('Demo user not found, skipping notification seed.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, habitRepository.find({ where: { user_id: user.id } })];
                case 2:
                    habits = _c.sent();
                    if (habits.length === 0) {
                        console.warn('No habits found for demo user, skipping notification seed.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, notificationRepository.count({
                            where: { user_id: user.id },
                        })];
                case 3:
                    existing = _c.sent();
                    if (existing > 0) {
                        console.info('Notifications already exist for demo user, skipping notification seed.');
                        return [2 /*return*/];
                    }
                    exerciseHabit = habits.find(function (h) { return h.name === 'Exercise'; });
                    readHabit = habits.find(function (h) { return h.name === 'Read'; });
                    return [4 /*yield*/, notificationRepository.insert([
                            {
                                user_id: user.id,
                                habit_id: (_a = exerciseHabit === null || exerciseHabit === void 0 ? void 0 : exerciseHabit.id) !== null && _a !== void 0 ? _a : null,
                                type: 'reminder',
                                title: 'Time to exercise!',
                                message: "Your daily workout is scheduled for now. Let's get moving!",
                                status: 'unread',
                                data: { habit_name: 'Exercise' },
                            },
                            {
                                user_id: user.id,
                                habit_id: (_b = readHabit === null || readHabit === void 0 ? void 0 : readHabit.id) !== null && _b !== void 0 ? _b : null,
                                type: 'reminder',
                                title: 'Reading time',
                                message: "Don't forget to read your 20 pages today.",
                                status: 'unread',
                                data: { habit_name: 'Read' },
                            },
                            {
                                user_id: user.id,
                                habit_id: null,
                                type: 'streak_milestone',
                                title: 'Welcome to Talon!',
                                message: "You've set up your first habits. Start building streaks today!",
                                status: 'unread',
                                data: { streak_count: 0 },
                            },
                            {
                                user_id: user.id,
                                habit_id: null,
                                type: 'tip',
                                title: 'Pro tip: Consistency over intensity',
                                message: 'Small daily actions beat occasional big efforts. Keep your streaks alive!',
                                status: 'read',
                                read_at: new Date(),
                                data: {},
                            },
                        ])];
                case 4:
                    _c.sent();
                    console.info('✓ 4 demo notifications created');
                    return [2 /*return*/];
            }
        });
    });
}
