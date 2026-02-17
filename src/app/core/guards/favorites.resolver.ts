// src/app/core/guards/favorites.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, take, timeout } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { Favorite } from '../models/favorite.model';
import * as FavoritesActions from '../../features/favorites/store/favorites.actions';
import * as FavoritesSelectors from '../../features/favorites/store/favorites.selectors';


export const favoritesResolver: ResolveFn<Favorite[]> = (route, state) => {
  const store = inject(Store);
  const authService = inject(AuthService);

  const currentUser = authService.getCurrentUser();

  if (!currentUser?.id) {
    return of([]);
  }

  store.dispatch(FavoritesActions.loadFavorites({ userId: currentUser.id }));

  return store.select(FavoritesSelectors.selectFavoritesLoading).pipe(
    filter(loading => !loading),
    take(1),
    timeout(5000),
    () => store.select(FavoritesSelectors.selectAllFavorites).pipe(take(1))
  );
};
