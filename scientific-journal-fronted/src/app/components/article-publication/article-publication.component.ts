import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG modules
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

import { ArticlePublicationService, ArticlePublication } from '../../services/article-publication.service';
import { ArticleService, Article } from '../../services/article.service';

// Interfaces for columns/export
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
  selector: 'app-article-publication',
  standalone: true,
  templateUrl: './article-publication.component.html',
  styleUrl: './article-publication.component.css',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    CalendarModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ArticlePublicationComponent implements OnInit {
  publicationDialog = false;
  publications = signal<ArticlePublication[]>([]);
  publication!: ArticlePublication;
  selectedPublications!: ArticlePublication[] | null;
  submitted = false;

  articles: Article[] = [];

  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private publicationService: ArticlePublicationService,
    private articleService: ArticleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadPublications();
    this.loadArticles();
    this.initializeColumns();
  }

  initializeColumns() {
    this.cols = [
      { field: 'articleId', header: 'Artículo' },
      { field: 'publicationDate', header: 'Fecha de publicación' },
      { field: 'isbn', header: 'ISBN' }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadPublications() {
    this.publicationService.getPublications().subscribe({
      next: (response) => this.publications.set(response.publications),
      error: () => this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las publicaciones', life: 3000
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
    return article ? article.title : articleId.toString();
  }

  openNew() {
    this.publication = {
      articleId: null,
      publicationDate: new Date(),
      isbn: ''
    };
    this.submitted = false;
    this.publicationDialog = true;
  }

  editPublication(pub: ArticlePublication) {
    this.publication = { ...pub };
    this.publicationDialog = true;
  }

  deletePublication(pub: ArticlePublication) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la publicación del artículo ID "${pub.articleId}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.publicationService.deletePublication(pub.id!).subscribe({
          next: () => {
            this.loadPublications();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Publicación eliminada', life: 3000
            });
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al eliminar la publicación', life: 3000
          })
        });
      }
    });
  }

  savePublication() {
    this.submitted = true;
    if (
      this.publication.articleId &&
      this.publication.publicationDate &&
      this.publication.isbn && this.publication.isbn.trim().length > 0
    ) {
      if (this.publication.id) {
        this.publicationService.updatePublication(this.publication.id, this.publication).subscribe({
          next: () => {
            this.loadPublications();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Publicación actualizada', life: 3000
            });
            this.publicationDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al actualizar la publicación', life: 3000
          })
        });
      } else {
        this.publicationService.createPublication(this.publication).subscribe({
          next: () => {
            this.loadPublications();
            this.messageService.add({
              severity: 'success', summary: 'Exitoso', detail: 'Publicación creada', life: 3000
            });
            this.publicationDialog = false;
          },
          error: () => this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'No Autorizado al crear la publicación', life: 3000
          })
        });
      }
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  hideDialog() {
    this.publicationDialog = false;
    this.submitted = false;
  }
}