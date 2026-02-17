import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { Favorite } from "../../../core/models/favorite.model";

@Injectable({ providedIn: 'root' })
export class FavoritesService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/favoritesOffers`;

  /**
   * Get favorites for a specific user
   */
  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
  }

  /**
   * Add a favorite
   */
  addFavorite(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(this.apiUrl, favorite);
  }

  /**
   * Remove a favorite by its ID
   */
  removeFavorite(favoriteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`);
  }

  /**
   * Check if a job is already in favorites
   */
  isFavorite(userId: number, jobId: string): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&jobId=${jobId}`);
  }
}
