// src/app/features/jobs/components/job-card/job-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../../core/models/job.model';
import {SalaryPipe} from "../../../../shared/pipes/salary.pipe";

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, SalaryPipe],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  @Input() job!: Job;
  @Input() isAuthenticated: boolean = false;
  @Input() isFavorite: boolean = false;
  @Input() isTracked: boolean = false;

  @Output() addToFavorites = new EventEmitter<Job>();
  @Output() trackApplication = new EventEmitter<Job>();

  openJob(): void {
    window.open(this.job.redirect_url, '_blank');
  }

  onAddToFavorites(): void {
    if (!this.isFavorite) {
      this.addToFavorites.emit(this.job);
    }
  }

  onTrackApplication(): void {
    if (!this.isTracked) {
      this.trackApplication.emit(this.job);
    }
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  getContractTypeBadge(): string {
    switch(this.job.contract_type?.toLowerCase()) {
      case 'permanent':
        return 'badge-success';
      case 'contract':
        return 'badge-warning';
      case 'temporary':
        return 'badge-primary';
      default:
        return 'badge-primary';
    }
  }
}
