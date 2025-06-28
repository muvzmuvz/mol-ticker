import { Routes } from '@angular/router';
import { Auth } from './components/auth/auth';
import { App } from './app';
import { Home } from './components/home/home';

export const routes: Routes = [
    {
        path: 'login',
        component: Auth
    },
    {
        path: '',
        component: Home
    }
];
