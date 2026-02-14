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
    const country = 'us'; // Can be dynamic based on location
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

  /**
   * Alternative: Search jobs using mock data for testing
   * Use this if you don't have API keys yet
   */
  searchJobsMock(searchParams: JobSearchParams): Observable<JobSearchResponse> {
    // Mock data for testing
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Angular Developer',
        company: { display_name: 'Tech Corp' },
        location: { display_name: 'New York, NY' },
        description: 'Looking for an experienced Angular developer...',
        created: new Date().toISOString(),
        redirect_url: 'https://example.com/job1',
        salary_min: 80000,
        salary_max: 120000,
        contract_type: 'Full-time'
      },
      {
        id: '2',
        title: 'Frontend Developer',
        company: { display_name: 'StartUp Inc' },
        location: { display_name: 'San Francisco, CA' },
        description: 'Join our dynamic team...',
        created: new Date().toISOString(),
        redirect_url: 'https://example.com/job2',
        salary_min: 70000,
        salary_max: 100000,
        contract_type: 'Full-time'
      }
    ];

    return new Observable(observer => {
      observer.next({
        results: mockJobs,
        count: mockJobs.length
      });
      observer.complete();
    });
  }
}
