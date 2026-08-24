"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("./user.service");
const user_repository_1 = require("../repositories/user.repository");
jest.mock('../repositories/user.repository');
describe('UserService', () => {
    let userService;
    beforeEach(() => {
        jest.clearAllMocks();
        userService = new user_service_1.UserService();
    });
    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const userData = { name: 'Test User', email: 'test@example.com', driverLicense: 'ABC1234' };
            const createdUser = { id: '1', ...userData, createdAt: new Date(), updatedAt: new Date() };
            jest.spyOn(user_repository_1.UserRepository.prototype, 'findByEmail').mockResolvedValue(null);
            jest.spyOn(user_repository_1.UserRepository.prototype, 'create').mockResolvedValue(createdUser);
            const result = await userService.createUser(userData);
            expect(user_repository_1.UserRepository.prototype.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(user_repository_1.UserRepository.prototype.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(createdUser);
        });
        it('should throw an error if user already exists', async () => {
            const userData = { name: 'Test User', email: 'test@example.com', driverLicense: 'ABC1234' };
            const existingUser = { id: '1', ...userData, createdAt: new Date(), updatedAt: new Date() };
            jest.spyOn(user_repository_1.UserRepository.prototype, 'findByEmail').mockResolvedValue(existingUser);
            await expect(userService.createUser(userData)).rejects.toThrow('User already exists');
            expect(user_repository_1.UserRepository.prototype.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(user_repository_1.UserRepository.prototype.create).not.toHaveBeenCalled();
        });
    });
    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [
                {
                    id: '1',
                    name: 'Test User',
                    email: 'test@example.com',
                    driverLicense: 'ABC1234',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            jest.spyOn(user_repository_1.UserRepository.prototype, 'findAll').mockResolvedValue(users);
            const result = await userService.getAllUsers();
            expect(result).toEqual(users);
            expect(user_repository_1.UserRepository.prototype.findAll).toHaveBeenCalled();
        });
    });
    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const user = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                driverLicense: 'ABC1234',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(user_repository_1.UserRepository.prototype, 'findById').mockResolvedValue(user);
            const result = await userService.getUserById('1');
            expect(result).toEqual(user);
            expect(user_repository_1.UserRepository.prototype.findById).toHaveBeenCalledWith('1');
        });
        it('should throw an error if user is not found', async () => {
            jest.spyOn(user_repository_1.UserRepository.prototype, 'findById').mockResolvedValue(null);
            await expect(userService.getUserById('1')).rejects.toThrow('User not found');
            expect(user_repository_1.UserRepository.prototype.findById).toHaveBeenCalledWith('1');
        });
    });
});
