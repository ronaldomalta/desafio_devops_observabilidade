"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalService = void 0;
const rental_repository_1 = require("../repositories/rental.repository");
const car_repository_1 = require("../repositories/car.repository");
const user_repository_1 = require("../repositories/user.repository");
class RentalService {
    rentalRepository;
    carRepository;
    userRepository;
    constructor() {
        this.rentalRepository = new rental_repository_1.RentalRepository();
        this.carRepository = new car_repository_1.CarRepository();
        this.userRepository = new user_repository_1.UserRepository();
    }
    async createRental(data) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
            throw new Error('User does not exist');
        }
        const car = await this.carRepository.findById(data.carId);
        if (!car) {
            throw new Error('Car does not exist');
        }
        if (!car.isAvailable) {
            throw new Error('Car is not available for rental');
        }
        const activeUserRental = await this.rentalRepository.findActiveByUserId(data.userId);
        if (activeUserRental) {
            throw new Error('User already has an active rental');
        }
        const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
        if (differenceInHours < 24) {
            throw new Error('Rental period must be at least 24 hours');
        }
        const days = Math.ceil(differenceInHours / 24);
        const totalAmount = days * car.dailyRate;
        const rental = await this.rentalRepository.create({
            userId: data.userId,
            carId: data.carId,
            startDate,
            endDate,
            totalAmount,
        });
        await this.carRepository.updateAvailability(data.carId, false);
        return rental;
    }
    async completeRental(rentalId) {
        const rental = await this.rentalRepository.findById(rentalId);
        if (!rental) {
            throw new Error('Rental not found');
        }
        if (rental.status === 'COMPLETED') {
            throw new Error('Rental is already completed');
        }
        await this.rentalRepository.completeRental(rentalId);
        await this.carRepository.updateAvailability(rental.carId, true);
        return { message: 'Rental completed successfully' };
    }
}
exports.RentalService = RentalService;
