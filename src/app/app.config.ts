import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { favoritesReducer } from './features/favorites/store/favorites.reducer';
import { FavoritesEffects } from './features/favorites/store/favorites.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([errorInterceptor])
    ),
    provideStore({
      favorites: favoritesReducer
    }),
    provideEffects([FavoritesEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};
