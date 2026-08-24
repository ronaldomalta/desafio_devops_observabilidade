"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
class UserService {
    userRepository;
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async createUser(data) {
        const userAlreadyExists = await this.userRepository.findByEmail(data.email);
        if (userAlreadyExists) {
            throw new Error('User already exists');
        }
        return this.userRepository.create(data);
    }
    async getAllUsers() {
        return this.userRepository.findAll();
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.UserService = UserService;
