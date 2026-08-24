"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarService = void 0;
const car_repository_1 = require("../repositories/car.repository");
class CarService {
    carRepository;
    constructor() {
        this.carRepository = new car_repository_1.CarRepository();
    }
    async createCar(data) {
        const carExists = await this.carRepository.findByLicensePlate(data.licensePlate);
        if (carExists) {
            throw new Error('Car with this license plate already exists');
        }
        return this.carRepository.create(data);
    }
    async getAllCars(availableOnly) {
        return this.carRepository.findAll(availableOnly);
    }
    async getCarById(id) {
        const car = await this.carRepository.findById(id);
        if (!car) {
            throw new Error('Car not found');
        }
        return car;
    }
}
exports.CarService = CarService;
