"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../database/prisma");
class UserRepository {
    async create(data) {
        return prisma_1.prisma.user.create({ data });
    }
    async findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    async findAll() {
        return prisma_1.prisma.user.findMany();
    }
}
exports.UserRepository = UserRepository;
