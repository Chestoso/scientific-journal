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
import { InputTextarea } from 'primeng/inputtextarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { EvaluationDetailService, EvaluationDetail } from '../../services/evaluation-detail.service';
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
  selector: 'app-evaluation-detail',
  standalone: true,
  templateUrl: './evaluation-detail.component.html',
  styleUrl: './evaluation-detail.component.css',
  imports: [
    CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, ToastModule, DialogModule,
    ConfirmDialogModule, DropdownModule, InputTextarea
  ],
  providers: [MessageService, ConfirmationService]
})
export class EvaluationDetailComponent implements OnInit {
  detailDialog = false;
  details = signal<EvaluationDetail[]>([]);
  detail!: EvaluationDetail;
  selectedDetails!: EvaluationDetail[] | null;
  submitted = false;

  evaluations: any[] = [];
  articles: Article[] = [];
  reviewers: Reviewer[] = [];
  statusOptions = [
    { label: 'Seleccione un estado', value: null },
    { label: 'Positivo', value: 'Positive' },
    { label: 'Negativo', value: 'Negative' },
    { label: 'Rechazado', value: 'Rejected' },
    { label: 'Neutral', value: 'Neutral' }
  ];

  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private detailService: EvaluationDetailService,
    private evaluationService: EvaluationService,
    private articleService: ArticleService,
    private reviewerService: ReviewerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadDetails();
    this.loadArticles();
    this.loadReviewers();
    this.loadEvaluations();
    this.initializeColumns();
  }

  initializeColumns() {
    this.cols = [
      { field: 'evaluationId', header: 'Evaluación' },
      { field: 'description', header: 'Descripción' },
      { field: 'evaluationStatus', header: 'Estado' }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadDetails() {
    this.detailService.getEvaluationDetails().subscribe({
      next: (response) => this.details.set(response.details),
      error: () => this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los detalles', life: 3000
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

  loadEvaluations() {
    this.evaluationService.getEvaluations().subscribe({
      next: (response) => {
        this.evaluations = response.evaluations.map(e => ({
          ...e,
          label: this.getEvaluationDropdownLabel(e),
          value: e.id
        }));
      },
      error: () => this.evaluations = []
    });
  }
  getArticleName(evaluationId: number): string {
    const evaluation = this.evaluations.find(e => e.value === evaluationId);
    const article = this.articles.find(a => a.id === evaluation?.articleId);
    return article ? article.title : '';
  }

  getReviewerName(evaluationId: number): string {
    const evaluation = this.evaluations.find(e => e.value === evaluationId);
    const reviewer = this.reviewers.find(r => r.id === evaluation?.reviewerId);
    return reviewer ? reviewer.fullName : '';
  }

  getEvaluationDropdownLabel(evaluation: any): string {
    if (!evaluation) return '';
    const article = this.articles.find(a => a.id === evaluation.articleId);
    const reviewer = this.reviewers.find(r => r.id === evaluation.reviewerId);
    return `ID: ${evaluation.id} - Artículo: ${article ? article.title : evaluation.articleId} - Revisor: ${reviewer ? reviewer.fullName : evaluation.reviewerId}`;
  }

  getEvaluationLabel(evaluationId: number): string {
    const evaluation = this.evaluations.find(e => e.value === evaluationId);
    return evaluation ? evaluation.label : evaluationId?.toString() || '';
  }

  getStatusLabel(status: string): string {
    const found = this.statusOptions.find(opt => opt.value === status);
    return found ? found.label : status;
  }

  openNew() {
    this.detail = {
      evaluationId: null,
      description: '',
      evaluationStatus: null
    };
    this.submitted = false;
    this.detailDialog = true;
  }

  editDetail(detail: EvaluationDetail) {
    this.detail = { ...detail };
    this.detailDialog = true;
  }

  deleteDetail(detail: EvaluationDetail) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el detalle de evaluación?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.detailService.deleteEvaluationDetail(detail.id!).subscribe({
          next: () => {
            this.loadDetails();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Detalle eliminado', life: 3000
            });
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al eliminar el detalle', life: 3000
          })
        });
      }
    });
  }

  saveDetail() {
    this.submitted = true;
    if (
      this.detail.evaluationId &&
      this.detail.description.trim().length > 0 &&
      !!this.detail.evaluationStatus
    ) {
      if (this.detail.id) {
        this.detailService.updateEvaluationDetail(this.detail.id, this.detail).subscribe({
          next: () => {
            this.loadDetails();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Detalle actualizado', life: 3000
            });
            this.detailDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al actualizar el detalle', life: 3000
          })
        });
      } else {
        this.detailService.createEvaluationDetail(this.detail).subscribe({
          next: () => {
            this.loadDetails();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Detalle creado', life: 3000
            });
            this.detailDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al crear el detalle', life: 3000
          })
        });
      }
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  hideDialog() {
    this.detailDialog = false;
    this.submitted = false;
  }
}