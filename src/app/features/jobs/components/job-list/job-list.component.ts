// src/app/features/jobs/components/job-list/job-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Job } from '../../../../core/models/job.model';
import { Favorite } from '../../../../core/models/favorite.model';
import { Application } from '../../../../core/models/application.model';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { JobCardComponent } from '../job-card/job-card.component';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, LoaderComponent, JobCardComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent {
  @Input() jobs: Job[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() isAuthenticated: boolean = false;
  @Input() favorites$!: Observable<Favorite[]>;
  @Input() trackedApplications: Application[] = [];

  @Output() addToFavorites = new EventEmitter<Job>();
  @Output() trackApplication = new EventEmitter<Job>();

  onAddToFavorites(job: Job): void {
    this.addToFavorites.emit(job);
  }

  onTrackApplication(job: Job): void {
    this.trackApplication.emit(job);
  }

  isFavorite(jobId: string, favorites: Favorite[]): boolean {
    return favorites.some(fav => fav.jobId === jobId);
  }

  isTracked(jobId: string): boolean {
    return this.trackedApplications.some(app => app.jobId === jobId);
  }
}
