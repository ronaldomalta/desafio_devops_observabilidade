"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalController = void 0;
const rental_service_1 = require("../services/rental.service");
class RentalController {
    rentalService;
    constructor() {
        this.rentalService = new rental_service_1.RentalService();
    }
    async create(req, res) {
        try {
            const { userId, carId, startDate, endDate } = req.body;
            const rental = await this.rentalService.createRental({
                userId,
                carId,
                startDate,
                endDate,
            });
            return res.status(201).json(rental);
        }
        catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        }
    }
    async complete(req, res) {
        try {
            const { id } = req.params;
            const result = await this.rentalService.completeRental(id);
            return res.json(result);
        }
        catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        }
    }
}
exports.RentalController = RentalController;
