"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedResult = createPaginatedResult;
function createPaginatedResult(data, total, page, limit) {
    return {
        data: data,
        meta: {
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
