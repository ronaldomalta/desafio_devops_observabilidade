"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarController = void 0;
const car_service_1 = require("../services/car.service");
class CarController {
    carService;
    constructor() {
        this.carService = new car_service_1.CarService();
    }
    async create(req, res) {
        try {
            const { brand, model, licensePlate, dailyRate } = req.body;
            const car = await this.carService.createCar({
                brand,
                model,
                licensePlate,
                dailyRate,
            });
            return res.status(201).json(car);
        }
        catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        }
    }
    async getAll(req, res) {
        try {
            const { availableOnly } = req.query;
            const cars = await this.carService.getAllCars(availableOnly === 'true');
            return res.json(cars);
        }
        catch (error) {
            return res.status(500).json({
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        }
    }
}
exports.CarController = CarController;
