import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { EvaluationService, Evaluation } from '../../services/evaluation.service';
import { ArticleService, Article } from '../../services/article.service';
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
  selector: 'app-evaluation',
  standalone: true,
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.css',
  imports: [
    CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, ToastModule, DialogModule,
    ConfirmDialogModule, DropdownModule, CalendarModule, InputTextModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class EvaluationComponent implements OnInit {
  evaluationDialog = false;
  evaluations = signal<Evaluation[]>([]);
  evaluation!: Evaluation;
  selectedEvaluations!: Evaluation[] | null;
  submitted = false;

  articles: Article[] = [];
  reviewers: Reviewer[] = [];
  statusOptions = [
    { label: 'Seleccione un estado', value: null },
    { label: 'Aprobado', value: 'Approved' },
    { label: 'Denegado con correcciones', value: 'Denied with corrections' },
    { label: 'Rechazado', value: 'Rejected' },
    { label: 'Pendiente', value: 'Pending' }
  ];

  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private evaluationService: EvaluationService,
    private articleService: ArticleService,
    private reviewerService: ReviewerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadEvaluations();
    this.loadArticles();
    this.loadReviewers();
    this.initializeColumns();
  }

  initializeColumns() {
    this.cols = [
      { field: 'articleId', header: 'Artículo' },
      { field: 'reviewerId', header: 'Revisor' },
      { field: 'evaluationDate', header: 'Fecha de evaluación' },
      { field: 'approvalStatus', header: 'Estado aprobación' }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadEvaluations() {
    this.evaluationService.getEvaluations().subscribe({
      next: (response) => this.evaluations.set(response.evaluations),
      error: () => this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las evaluaciones', life: 3000
      })
    });
  }

  loadArticles() {
    this.articleService.getArticles().subscribe({
      next: (response) => this.articles = response.articles,
      error: () => this.articles = []
    });
  }

  loadReviewers() {
    this.reviewerService.getReviewers().subscribe({
      next: (response) => this.reviewers = response.reviewers,
      error: () => this.reviewers = []
    });
  }

  getArticleTitle(articleId: number): string {
    const article = this.articles.find(a => a.id === articleId);
    return article ? article.title : articleId?.toString() || '';
  }

  getReviewerName(reviewerId: number): string {
    const reviewer = this.reviewers.find(r => r.id === reviewerId);
    return reviewer ? reviewer.fullName : reviewerId?.toString() || '';
  }

  getStatusLabel(status: string): string {
    const found = this.statusOptions.find(opt => opt.value === status);
    return found ? found.label : status;
  }

  openNew() {
    this.evaluation = {
      articleId: null,
      reviewerId: null,
      evaluationDate: new Date(),
      approvalStatus: null
    };
    this.submitted = false;
    this.evaluationDialog = true;
  }

  editEvaluation(evaluation: Evaluation) {
    this.evaluation = { ...evaluation };
    this.evaluationDialog = true;
  }

  deleteEvaluation(evaluation: Evaluation) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la evaluación?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.evaluationService.deleteEvaluation(evaluation.id!).subscribe({
          next: () => {
            this.loadEvaluations();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Evaluación eliminada', life: 3000
            });
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al eliminar la evaluación', life: 3000
          })
        });
      }
    });
  }

  saveEvaluation() {
    this.submitted = true;
    if (
      this.evaluation.articleId &&
      this.evaluation.reviewerId &&
      this.evaluation.evaluationDate &&
      !!this.evaluation.approvalStatus
    ) {
      if (this.evaluation.id) {
        this.evaluationService.updateEvaluation(this.evaluation.id, this.evaluation).subscribe({
          next: () => {
            this.loadEvaluations();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Evaluación actualizada', life: 3000
            });
            this.evaluationDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al actualizar la evaluación', life: 3000
          })
        });
      } else {
        this.evaluationService.createEvaluation(this.evaluation).subscribe({
          next: () => {
            this.loadEvaluations();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Evaluación creada', life: 3000
            });
            this.evaluationDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al crear la evaluación', life: 3000
          })
        });
      }
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  hideDialog() {
    this.evaluationDialog = false;
    this.submitted = false;
  }
}