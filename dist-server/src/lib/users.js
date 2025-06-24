"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUserById = getUserById;
exports.UpdateUser = UpdateUser;
const prisma_1 = __importDefault(require("./prisma"));
async function createUser(data) {
    try {
        const user = await prisma_1.default.user.create({ data });
        return { user };
    }
    catch (error) {
        return { error };
    }
}
async function getUserById({ id, clerkUserId }) {
    try {
        if (!id && !clerkUserId) {
            throw new Error('id or clerkUserId is required');
        }
        const query = id ? { id } : { clerkUserId };
        const user = await prisma_1.default.user.findUnique({ where: query });
        return { user };
    }
    catch (error) {
        return { error };
    }
}
async function UpdateUser(id, data) {
    try {
        const user = await prisma_1.default.user.update({
            where: { id },
            data
        });
        return { user };
    }
    catch (error) {
        return { error };
    }
}
