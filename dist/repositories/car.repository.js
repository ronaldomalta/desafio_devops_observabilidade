"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarRepository = void 0;
const prisma_1 = require("../database/prisma");
class CarRepository {
    async create(data) {
        return prisma_1.prisma.car.create({ data });
    }
    async findById(id) {
        return prisma_1.prisma.car.findUnique({ where: { id } });
    }
    async findByLicensePlate(licensePlate) {
        return prisma_1.prisma.car.findUnique({ where: { licensePlate } });
    }
    async findAll(availableOnly) {
        const where = availableOnly ? { isAvailable: true } : {};
        return prisma_1.prisma.car.findMany({ where });
    }
    async updateAvailability(id, isAvailable) {
        return prisma_1.prisma.car.update({
            where: { id },
            data: { isAvailable },
        });
    }
}
exports.CarRepository = CarRepository;
