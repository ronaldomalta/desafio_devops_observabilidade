"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRepository = void 0;
const prisma_1 = require("../database/prisma");
class RentalRepository {
    async create(data) {
        return prisma_1.prisma.rental.create({ data });
    }
    async findActiveByUserId(userId) {
        return prisma_1.prisma.rental.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
            },
        });
    }
    async findActiveByCarId(carId) {
        return prisma_1.prisma.rental.findFirst({
            where: {
                carId,
                status: 'ACTIVE',
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.rental.findUnique({
            where: { id },
            include: { car: true, user: true },
        });
    }
    async completeRental(id) {
        return prisma_1.prisma.rental.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });
    }
}
exports.RentalRepository = RentalRepository;
