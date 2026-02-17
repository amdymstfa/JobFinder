// src/app/features/applications/components/applications-list/applications-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Application, ApplicationStatus } from '../../../../core/models/application.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ApplicationsService } from '../../services/applications.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ApplicationCardComponent } from '../application-card/application-card.component';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, ApplicationCardComponent],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.css'
})
export class ApplicationsListComponent implements OnInit {
  private authService = inject(AuthService);
  private applicationsService = inject(ApplicationsService);

  applications: Application[] = [];
  filteredApplications: Application[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentUser = this.authService.getCurrentUser();

  selectedFilter: ApplicationStatus | 'all' = 'all';
  ApplicationStatus = ApplicationStatus;

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    if (!this.currentUser?.id) {
      this.error = 'Please login to view your applications.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.applicationsService.getApplications(this.currentUser.id).subscribe({
      next: (apps) => {
        this.applications = apps.sort((a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        this.filteredApplications = this.applications;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load applications. Please try again.';
        console.error('Load applications error:', err);
      }
    });
  }

  filterByStatus(status: ApplicationStatus | 'all'): void {
    this.selectedFilter = status;

    if (status === 'all') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(app => app.status === status);
    }
  }

  onUpdateStatus(data: { application: Application, newStatus: ApplicationStatus }): void {
    const { application, newStatus } = data;

    if (!application.id) return;

    this.applicationsService.updateApplication(application.id, { status: newStatus }).subscribe({
      next: (updatedApp) => {
        // Update local array
        const index = this.applications.findIndex(app => app.id === application.id);
        if (index !== -1) {
          this.applications[index] = updatedApp;
        }

        // Re-apply filter
        this.filterByStatus(this.selectedFilter);
      },
      error: (err) => {
        this.error = 'Failed to update status.';
        console.error('Update status error:', err);
      }
    });
  }

  onUpdateNotes(data: { application: Application, notes: string }): void {
    const { application, notes } = data;

    if (!application.id) return;

    this.applicationsService.updateApplication(application.id, { notes }).subscribe({
      next: (updatedApp) => {
        // Update local array
        const index = this.applications.findIndex(app => app.id === application.id);
        if (index !== -1) {
          this.applications[index] = updatedApp;
        }
      },
      error: (err) => {
        this.error = 'Failed to update notes.';
        console.error('Update notes error:', err);
      }
    });
  }

  onDeleteApplication(application: Application): void {
    if (!application.id) return;

    if (!confirm(`Are you sure you want to delete the application for "${application.title}"?`)) {
      return;
    }

    this.applicationsService.deleteApplication(application.id).subscribe({
      next: () => {
        // Remove from local array
        this.applications = this.applications.filter(app => app.id !== application.id);

        // Re-apply filter
        this.filterByStatus(this.selectedFilter);
      },
      error: (err) => {
        this.error = 'Failed to delete application.';
        console.error('Delete application error:', err);
      }
    });
  }

  getCountByStatus(status: ApplicationStatus | 'all'): number {
    if (status === 'all') {
      return this.applications.length;
    }
    return this.applications.filter(app => app.status === status).length;
  }

  openJob(url: string): void {
    window.open(url, '_blank');
  }
}
