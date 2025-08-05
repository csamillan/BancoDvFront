import { Routes } from '@angular/router';
import { LayoutComponent } from './Pages/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'clients',
                pathMatch: 'full'
            },
            {
                path: 'clients',
                loadComponent: () => import('./Pages/client-page/client-page.component')
            },
            {
                path: 'accounts',
                loadComponent: () => import('./Pages/account-page/account-page.component')
            },
            {
                path: 'transactions',
                loadComponent: () => import('./Pages/transaction-page/transaction-page.component')
            },
            {
                path: '**',
                loadComponent: () => import('./Pages/not-found-page/not-found-page.component')
            }
        ]
    },
    

];
