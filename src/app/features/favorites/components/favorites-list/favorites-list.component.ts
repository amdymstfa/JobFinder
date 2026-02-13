import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Favorite } from '../../../../core/models/favorite.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import * as FavoritesActions from '../../store/favorites.actions';
import * as FavoritesSelectors from '../../store/favorites.selectors';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './favorites-list.component.html',
  styleUrl: './favorites-list.component.css'
})
export class FavoritesListComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  favorites$: Observable<Favorite[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor() {
    this.favorites$ = this.store.select(FavoritesSelectors.selectAllFavorites);
    this.loading$ = this.store.select(FavoritesSelectors.selectFavoritesLoading);
    this.error$ = this.store.select(FavoritesSelectors.selectFavoritesError);
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: currentUser.id }));
    }
  }

  removeFavorite(favorite: Favorite): void {
    if (favorite.id && confirm('Remove this job from favorites?')) {
      this.store.dispatch(FavoritesActions.removeFavorite({ id: favorite.id }));
    }
  }

  openJob(url: string): void {
    window.open(url, '_blank');
  }
}
