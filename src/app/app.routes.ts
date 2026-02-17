import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { favoritesResolver } from './core/guards/favorites.resolver'; // ← AJOUTER

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/jobs',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/auth/components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/components/job-search/job-search.component').then(m => m.JobSearchComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/components/favorites-list/favorites-list.component').then(m => m.FavoritesListComponent),
    canActivate: [authGuard],
    resolve: { favorites: favoritesResolver }
  },
  {
    path: 'applications',
    loadComponent: () => import('./features/applications/components/applications-list/applications-list.component').then(m => m.ApplicationsListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/jobs'
  }
];
