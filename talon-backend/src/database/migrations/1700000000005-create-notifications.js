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
exports.CreateNotifications1700000000005 = void 0;
var typeorm_1 = require("typeorm");
var CreateNotifications1700000000005 = /** @class */ (function () {
    function CreateNotifications1700000000005() {
    }
    CreateNotifications1700000000005.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                            name: 'notifications',
                            columns: [
                                {
                                    name: 'id',
                                    type: 'uuid',
                                    isPrimary: true,
                                    generationStrategy: 'uuid',
                                    default: 'gen_random_uuid()',
                                },
                                {
                                    name: 'user_id',
                                    type: 'uuid',
                                    isNullable: false,
                                },
                                {
                                    name: 'habit_id',
                                    type: 'uuid',
                                    isNullable: true,
                                },
                                {
                                    name: 'type',
                                    type: 'varchar',
                                    length: '30',
                                    isNullable: false,
                                },
                                {
                                    name: 'title',
                                    type: 'varchar',
                                    length: '200',
                                    isNullable: false,
                                },
                                {
                                    name: 'message',
                                    type: 'text',
                                    isNullable: false,
                                },
                                {
                                    name: 'status',
                                    type: 'varchar',
                                    length: '20',
                                    isNullable: false,
                                    default: "'unread'",
                                },
                                {
                                    name: 'read_at',
                                    type: 'timestamp with time zone',
                                    isNullable: true,
                                },
                                {
                                    name: 'data',
                                    type: 'jsonb',
                                    isNullable: true,
                                },
                                {
                                    name: 'created_at',
                                    type: 'timestamp with time zone',
                                    isNullable: false,
                                    default: 'CURRENT_TIMESTAMP',
                                },
                            ],
                        }), true)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey('notifications', new typeorm_1.TableForeignKey({
                                name: 'FK_NOTIFICATIONS_USER_ID',
                                columnNames: ['user_id'],
                                referencedTableName: 'users',
                                referencedColumnNames: ['id'],
                                onDelete: 'CASCADE',
                            }))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey('notifications', new typeorm_1.TableForeignKey({
                                name: 'FK_NOTIFICATIONS_HABIT_ID',
                                columnNames: ['habit_id'],
                                referencedTableName: 'habits',
                                referencedColumnNames: ['id'],
                                onDelete: 'SET NULL',
                            }))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex('notifications', new typeorm_1.TableIndex({
                                name: 'IDX_NOTIFICATIONS_USER_STATUS',
                                columnNames: ['user_id', 'status'],
                            }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex('notifications', new typeorm_1.TableIndex({
                                name: 'IDX_NOTIFICATIONS_USER_CREATED',
                                columnNames: ['user_id', 'created_at'],
                            }))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex('notifications', new typeorm_1.TableIndex({
                                name: 'IDX_NOTIFICATIONS_HABIT_ID',
                                columnNames: ['habit_id'],
                            }))];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNotifications1700000000005.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.dropTable('notifications')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreateNotifications1700000000005;
}());
exports.CreateNotifications1700000000005 = CreateNotifications1700000000005;
