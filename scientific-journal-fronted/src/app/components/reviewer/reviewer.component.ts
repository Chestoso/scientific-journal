import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ReviewerService, Reviewer } from '../../services/reviewer.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-reviewer',
  standalone: true,
  templateUrl: './reviewer.component.html',
  styleUrl: './reviewer.component.css',
  imports: [
    CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, ToastModule, DialogModule,
    ConfirmDialogModule, InputTextModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ReviewerComponent implements OnInit {
  reviewerDialog = false;
  reviewers = signal<Reviewer[]>([]);
  reviewer!: Reviewer;
  selectedReviewers!: Reviewer[] | null;
  submitted = false;

  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private reviewerService: ReviewerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadReviewers();
    this.initializeColumns();
  }

  initializeColumns() {
    this.cols = [
      { field: 'fullName', header: 'Nombre' },
      { field: 'specialty', header: 'Especialidad' },
      { field: 'email', header: 'Email' },
      { field: 'university', header: 'Universidad' }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadReviewers() {
    this.reviewerService.getReviewers().subscribe({
      next: (response) => this.reviewers.set(response.reviewers),
      error: () => this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los revisores', life: 3000
      })
    });
  }

  openNew() {
    this.reviewer = {
      fullName: '',
      specialty: '',
      email: '',
      university: ''
    };
    this.submitted = false;
    this.reviewerDialog = true;
  }

  editReviewer(reviewer: Reviewer) {
    this.reviewer = { ...reviewer };
    this.reviewerDialog = true;
  }

  deleteReviewer(reviewer: Reviewer) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar al revisor "${reviewer.fullName}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reviewerService.deleteReviewer(reviewer.id!).subscribe({
          next: () => {
            this.loadReviewers();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Revisor eliminado', life: 3000
            });
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al eliminar el revisor', life: 3000
          })
        });
      }
    });
  }

  saveReviewer() {
    this.submitted = true;
    if (
      this.reviewer.fullName.trim().length > 0 &&
      this.reviewer.specialty.trim().length > 0 &&
      this.reviewer.email.trim().length > 0 &&
      this.reviewer.university.trim().length > 0
    ) {
      if (this.reviewer.id) {
        this.reviewerService.updateReviewer(this.reviewer.id, this.reviewer).subscribe({
          next: () => {
            this.loadReviewers();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Revisor actualizado', life: 3000
            });
            this.reviewerDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al actualizar el revisor', life: 3000
          })
        });
      } else {
        this.reviewerService.createReviewer(this.reviewer).subscribe({
          next: () => {
            this.loadReviewers();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Revisor creado', life: 3000
            });
            this.reviewerDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al crear el revisor', life: 3000
          })
        });
      }
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  hideDialog() {
    this.reviewerDialog = false;
    this.submitted = false;
  }
}