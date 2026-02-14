import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../../../core/models/application.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  /**
   * Get all applications for a user
   */
  getApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
  }

  /**
   * Add a new application
   */
  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  /**
   * Update an application
   */
  updateApplication(id: number, application: Partial<Application>): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, application);
  }

  /**
   * Delete an application
   */
  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Check if a job is already tracked
   */
  isTracked(userId: number, jobId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&jobId=${jobId}`);
  }
}
