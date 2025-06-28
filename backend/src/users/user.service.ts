// src/users/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // Метод для создания пользователя (админ или гость)
    async create(username: string, password: string, role: 'admin' | 'guest' = 'guest'): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ username, password: hashedPassword, role });
        return this.userRepository.save(user);
    }

    // Поиск по имени пользователя
    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }
    // Добавь этот метод внутрь класса UsersService
    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

}
