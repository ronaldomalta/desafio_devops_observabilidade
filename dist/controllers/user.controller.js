"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    async create(req, res) {
        try {
            const { name, email, driverLicense } = req.body;
            const user = await this.userService.createUser({ name, email, driverLicense });
            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
