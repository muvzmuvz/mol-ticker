import { Controller, Post, Body, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

// Extend Express Request interface to include 'user'
declare module 'express' {
    interface Request {
        user?: any;
    }
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) throw new Error('Неверные данные');
        return this.authService.login(user);
    }

    // Получаем роль без JWT, предполагая, что есть сессия или другой метод аутентификации
    @Get('role')
    @UseGuards(AuthGuard('jwt'))  // Используем JWT Guard для защиты этого эндпоинта
    getRole(@Req() req: Request) {
        // Если пользователь авторизован — вернём роль,
        // иначе вернём роль по умолчанию или пустую
        const role = req.user?.role || 'guest';  // Например, роль для неавторизованных — guest
        return { role };
    }
}
