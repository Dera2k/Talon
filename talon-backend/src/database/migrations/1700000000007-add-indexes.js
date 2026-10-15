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
exports.AddIndexes1700000000007 = void 0;
var typeorm_1 = require("typeorm");
var AddIndexes1700000000007 = /** @class */ (function () {
    function AddIndexes1700000000007() {
    }
    AddIndexes1700000000007.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Habits: composite index for dashboard queries
                    return [4 /*yield*/, queryRunner.createIndex('habits', new typeorm_1.TableIndex({
                            name: 'IDX_HABITS_USER_FREQUENCY_ARCHIVED',
                            columnNames: ['user_id', 'frequency', 'is_archived'],
                        }))];
                    case 1:
                        // Habits: composite index for dashboard queries
                        _a.sent();
                        // Habit completions: composite for streak calculations
                        return [4 /*yield*/, queryRunner.createIndex('habit_completions', new typeorm_1.TableIndex({
                                name: 'IDX_HABIT_COMPLETIONS_HABIT_DATE_DESC',
                                columnNames: ['habit_id', 'date'],
                                isUnique: false,
                            }))];
                    case 2:
                        // Habit completions: composite for streak calculations
                        _a.sent();
                        // Habit completions: for analytics calendar heatmap
                        return [4 /*yield*/, queryRunner.createIndex('habit_completions', new typeorm_1.TableIndex({
                                name: 'IDX_HABIT_COMPLETIONS_USER_DATE_STATUS',
                                columnNames: ['user_id', 'date', 'status'],
                            }))];
                    case 3:
                        // Habit completions: for analytics calendar heatmap
                        _a.sent();
                        // Streaks: for leaderboard/stats queries
                        return [4 /*yield*/, queryRunner.createIndex('streaks', new typeorm_1.TableIndex({
                                name: 'IDX_STREAKS_USER_CURRENT_DESC',
                                columnNames: ['user_id', 'current_streak'],
                            }))];
                    case 4:
                        // Streaks: for leaderboard/stats queries
                        _a.sent();
                        // Notifications: for unread count
                        return [4 /*yield*/, queryRunner.createIndex('notifications', new typeorm_1.TableIndex({
                                name: 'IDX_NOTIFICATIONS_USER_UNREAD_CREATED',
                                columnNames: ['user_id', 'status', 'created_at'],
                            }))];
                    case 5:
                        // Notifications: for unread count
                        _a.sent();
                        // Password reset tokens: cleanup expired tokens
                        return [4 /*yield*/, queryRunner.createIndex('password_reset_tokens', new typeorm_1.TableIndex({
                                name: 'IDX_PASSWORD_RESET_TOKENS_UNUSED_EXPIRES',
                                columnNames: ['used_at', 'expires_at'],
                                where: 'used_at IS NULL',
                            }))];
                    case 6:
                        // Password reset tokens: cleanup expired tokens
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AddIndexes1700000000007.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.dropIndex('habits', 'IDX_HABITS_USER_FREQUENCY_ARCHIVED')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropIndex('habit_completions', 'IDX_HABIT_COMPLETIONS_HABIT_DATE_DESC')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropIndex('habit_completions', 'IDX_HABIT_COMPLETIONS_USER_DATE_STATUS')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropIndex('streaks', 'IDX_STREAKS_USER_CURRENT_DESC')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_USER_UNREAD_CREATED')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropIndex('password_reset_tokens', 'IDX_PASSWORD_RESET_TOKENS_UNUSED_EXPIRES')];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AddIndexes1700000000007;
}());
exports.AddIndexes1700000000007 = AddIndexes1700000000007;
