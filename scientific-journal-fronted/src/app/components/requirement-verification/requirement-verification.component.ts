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

import { RequirementVerificationService, RequirementVerification } from '../../services/requirement-verification.service';
import { ArticleService, Article } from '../../services/article.service';

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
  selector: 'app-requirement-verification',
  standalone: true,
  templateUrl: './requirement-verification.component.html',
  styleUrl: './requirement-verification.component.css',
  imports: [
    CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, ToastModule, DialogModule,
    ConfirmDialogModule, DropdownModule, CalendarModule, InputTextModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class RequirementVerificationComponent implements OnInit {
  verificationDialog = false;
  verifications = signal<RequirementVerification[]>([]);
  verification!: RequirementVerification;
  selectedVerifications!: RequirementVerification[] | null;
  submitted = false;

  articles: Article[] = [];
  meetsOptions = [
    { label: 'Seleccione una opción', value: null },
    { label: 'Sí', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];

  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private verificationService: RequirementVerificationService,
    private articleService: ArticleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadVerifications();
    this.loadArticles();
    this.initializeColumns();
  }

  initializeColumns() {
    this.cols = [
      { field: 'articleId', header: 'Artículo' },
      { field: 'verificationDate', header: 'Fecha de verificación' },
      { field: 'meetsRequirements', header: 'Cumple requisitos' },
      { field: 'observations', header: 'Observaciones' }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadVerifications() {
    this.verificationService.getVerifications().subscribe({
      next: (response) => this.verifications.set(response.verifications),
      error: () => this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las verificaciones', life: 3000
      })
    });
  }

  loadArticles() {
    this.articleService.getArticles().subscribe({
      next: (response) => this.articles = response.articles,
      error: () => this.articles = []
    });
  }

  getArticleTitle(articleId: number): string {
    const article = this.articles.find(a => a.id === articleId);
    return article ? article.title : articleId?.toString() || '';
  }

  openNew() {
    this.verification = {
      articleId: null,
      verificationDate: new Date(),
      meetsRequirements: null,
      observations: ''
    };
    this.submitted = false;
    this.verificationDialog = true;
  }

  editVerification(verification: RequirementVerification) {
    this.verification = { ...verification };
    this.verificationDialog = true;
  }

  deleteVerification(verification: RequirementVerification) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la verificación del artículo ID "${verification.articleId}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.verificationService.deleteVerification(verification.id!).subscribe({
          next: () => {
            this.loadVerifications();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Verificación eliminada', life: 3000
            });
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al eliminar la verificación', life: 3000
          })
        });
      }
    });
  }

  saveVerification() {
    this.submitted = true;
    if (
      this.verification.articleId &&
      this.verification.verificationDate &&
      !!this.verification.meetsRequirements
    ) {
      if (this.verification.id) {
        this.verificationService.updateVerification(this.verification.id, this.verification).subscribe({
          next: () => {
            this.loadVerifications();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Verificación actualizada', life: 3000
            });
            this.verificationDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al actualizar la verificación', life: 3000
          })
        });
      } else {
        this.verificationService.createVerification(this.verification).subscribe({
          next: () => {
            this.loadVerifications();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Verificación creada', life: 3000
            });
            this.verificationDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al crear la verificación', life: 3000
          })
        });
      }
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  hideDialog() {
    this.verificationDialog = false;
    this.submitted = false;
  }
}