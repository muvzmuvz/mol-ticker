// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { RolesGuard } from './roles.guard';
import { UsersService } from '../users/user.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Module({
    imports: [
         TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: 'top-secret-key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, JwtStrategy, UsersService, RolesGuard],
    controllers: [AuthController],
    exports: [AuthService, JwtModule], // <--- ВАЖНО!
})
export class AuthModule { }
