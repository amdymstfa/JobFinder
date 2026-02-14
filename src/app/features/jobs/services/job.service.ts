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
   * Search for jobs using API

   */
  searchJobs(searchParams: JobSearchParams): Observable<JobSearchResponse> {
    const { keywords, location, page = 1, results_per_page = 10 } = searchParams;

    //  API endpoint structure: /v1/api/jobs/{country}/search/{page}
    const country = 'uk';
    const url = `${environment.jobApiUrl}/${country}/search/${page}`;

    let params = new HttpParams()
      .set('app_id', environment.jobApiId)
      .set('app_key', environment.jobApiKey)
      .set('results_per_page', results_per_page.toString())
      .set('what', keywords)
      .set('where', location)
      .set('sort_by', 'date');

    return this.http.get<JobSearchResponse>(url, { params });
  }
  
}
