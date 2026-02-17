import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobSearchParams, JobSearchResponse } from '../../../core/models/job.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);

  /**
   * Search jobs via Adzuna API
   * The API already uses relevance ranking that prioritizes title matches.
   * We return results as-is to provide better user experience.
   */
  searchJobs(searchParams: JobSearchParams): Observable<JobSearchResponse> {
    const { keywords, location, page = 1, results_per_page = 10 } = searchParams;

    const country = 'us';
    const url = `${environment.jobApiUrl}/${country}/search/${page}`;

    let params = new HttpParams()
      .set('app_id', environment.jobApiId)
      .set('app_key', environment.jobApiKey)
      .set('results_per_page', results_per_page.toString())
      .set('what', keywords)
      .set('where', location)
      .set('sort_by', 'date');

    console.log('🌐 Full URL:', url);
    console.log('📋 Params:', params.toString());

    return this.http.get<JobSearchResponse>(url, { params });
  }
}
