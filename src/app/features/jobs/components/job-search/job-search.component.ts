// src/app/features/jobs/components/job-search/job-search.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { JobService } from '../../services/job.service';
import { Job, JobSearchParams } from '../../../../core/models/job.model';
import { Favorite } from '../../../../core/models/favorite.model';
import { Application, ApplicationStatus } from '../../../../core/models/application.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ApplicationsService } from '../../../applications/services/applications.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { JobListComponent } from '../job-list/job-list.component';

import * as FavoritesActions from '../../../favorites/store/favorites.actions';
import * as FavoritesSelectors from '../../../favorites/store/favorites.selectors';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, JobListComponent],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css'
})
export class JobSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  private applicationsService = inject(ApplicationsService);
  private store = inject(Store);

  searchForm: FormGroup;
  jobs: Job[] = [];
  loading: boolean = false;
  error: string | null = null;
  totalResults: number = 0;
  currentPage: number = 1;
  resultsPerPage: number = 10;

  isAuthenticated: boolean = false;
  currentUser = this.authService.getCurrentUser();
  favorites$: Observable<Favorite[]>;
  trackedApplications: Application[] = [];

  successMessage: string = '';

  constructor() {
    this.searchForm = this.fb.group({
      keywords: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.favorites$ = this.store.select(FavoritesSelectors.selectAllFavorites);
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.currentUser?.id) {
      // Load favorites
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: this.currentUser.id }));

      // Load tracked applications
      this.loadTrackedApplications();
    }

    // Default search for demo
    this.searchForm.patchValue({
      keywords: 'Angular',
      location: 'New York'
    });

    // this.onSearch();
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormGroupTouched(this.searchForm);
      return;
    }

    this.loading = true;
    this.error = null;
    this.jobs = [];

    const searchParams: JobSearchParams = {
      keywords: this.searchForm.value.keywords,
      location: this.searchForm.value.location,
      page: this.currentPage,
      results_per_page: this.resultsPerPage
    };


    this.jobService.searchJobs(searchParams).subscribe({
      next: (response) => {
        this.jobs = response.results;
        this.totalResults = response.count;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load jobs. Please try again.';
        console.error('Search error:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.onSearch();
  }

  onAddToFavorites(job: Job): void {
    if (!this.currentUser?.id) {
      this.error = 'Please login to add favorites.';
      return;
    }

    const favorite: Favorite = {
      userId: this.currentUser.id,
      jobId: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      url: job.redirect_url,
      salary: job.salary_min
        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max?.toLocaleString()}`
        : undefined,
      dateAdded: new Date().toISOString()
    };

    this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
    this.showSuccessMessage('Job added to favorites!');
  }

  onTrackApplication(job: Job): void {
    if (!this.currentUser?.id) {
      this.error = 'Please login to track applications.';
      return;
    }

    const application: Application = {
      userId: this.currentUser.id,
      jobId: job.id,
      apiSource: 'adzuna',
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      url: job.redirect_url,
      status: ApplicationStatus.PENDING,
      notes: '',
      dateAdded: new Date().toISOString()
    };

    this.applicationsService.addApplication(application).subscribe({
      next: (app) => {
        this.trackedApplications.push(app);
        this.showSuccessMessage('Application tracked successfully!');
      },
      error: (err) => {
        this.error = 'Failed to track application.';
        console.error('Track application error:', err);
      }
    });
  }

  isFavorite(jobId: string): Observable<boolean> {
    return this.store.select(FavoritesSelectors.selectIsFavorite(jobId));
  }

  isTracked(jobId: string): boolean {
    return this.trackedApplications.some(app => app.jobId === jobId);
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.jobs = [];
    this.totalResults = 0;
    this.currentPage = 1;
    this.error = null;
  }

  private loadTrackedApplications(): void {
    if (this.currentUser?.id) {
      this.applicationsService.getApplications(this.currentUser.id).subscribe({
        next: (apps) => {
          this.trackedApplications = apps;
        },
        error: (err) => {
          console.error('Load applications error:', err);
        }
      });
    }
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get f() {
    return this.searchForm.controls;
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.resultsPerPage);
  }
}
