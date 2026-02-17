import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Application, ApplicationStatus } from '../../../../core/models/application.model';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css'
})
export class ApplicationCardComponent {
  @Input() application!: Application;

  @Output() updateStatus = new EventEmitter<{ application: Application, newStatus: ApplicationStatus }>();
  @Output() updateNotes = new EventEmitter<{ application: Application, notes: string }>();
  @Output() deleteApplication = new EventEmitter<Application>();

  ApplicationStatus = ApplicationStatus;
  isEditingNotes: boolean = false;
  editedNotes: string = '';

  ngOnInit(): void {
    this.editedNotes = this.application.notes || '';
  }

  onStatusChange(newStatus: ApplicationStatus): void {
    this.updateStatus.emit({ application: this.application, newStatus });
  }

  toggleEditNotes(): void {
    this.isEditingNotes = !this.isEditingNotes;
    if (!this.isEditingNotes) {
      // Cancel edit
      this.editedNotes = this.application.notes || '';
    }
  }

  saveNotes(): void {
    this.updateNotes.emit({ application: this.application, notes: this.editedNotes });
    this.isEditingNotes = false;
  }

  onDelete(): void {
    this.deleteApplication.emit(this.application);
  }

  openJob(): void {
    window.open(this.application.url, '_blank');
  }

  getStatusBadgeClass(): string {
    switch(this.application.status) {
      case ApplicationStatus.PENDING:
        return 'badge badge-warning';
      case ApplicationStatus.ACCEPTED:
        return 'badge badge-success';
      case ApplicationStatus.REJECTED:
        return 'badge badge-danger';
      default:
        return 'badge badge-primary';
    }
  }

  getStatusIcon(): string {
    switch(this.application.status) {
      case ApplicationStatus.PENDING:
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case ApplicationStatus.ACCEPTED:
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case ApplicationStatus.REJECTED:
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
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
}
