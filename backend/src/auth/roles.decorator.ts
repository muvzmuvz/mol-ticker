import { SetMetadata } from '@nestjs/common';

// Ключ, под которым роли будут храниться в метаданных
export const ROLES_KEY = 'roles';

// Декоратор принимает список ролей и сохраняет их в метаданных маршрута
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
