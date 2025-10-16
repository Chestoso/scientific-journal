import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { ArticleService, Article } from '../../services/article.service';
import { TeacherService, Teacher } from '../../services/teacher.service';
import { Table } from 'primeng/table';

import { InputTextarea } from 'primeng/inputtextarea';

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
  selector: 'app-crud',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    CalendarModule,
    HttpClientModule
  ],
  providers: [MessageService, ArticleService, TeacherService, ConfirmationService],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  articleDialog: boolean = false;

  articles = signal<Article[]>([]);
  article!: Article;

  selectedArticles!: Article[] | null;

  submitted: boolean = false;

  teachers: Teacher[] = [];
  authorTypes = [
    { label: 'Seleccione un tipo', value: null },
    { label: 'Principal', value: 'Principal' },
    { label: 'Coautor', value: 'Coauthor' }
  ];

  cols!: Column[];
  exportColumns!: ExportColumn[];

  @ViewChild('dt') dt!: Table;

  constructor(
    private articleService: ArticleService,
    private teacherService: TeacherService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.loadArticles();
    this.loadTeachers();
    this.initializeColumns();
  }

  loadArticles() {
    this.articleService.getArticles().subscribe({
      next: (response: { articles: Article[] }) => this.articles.set(response.articles),
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los artículos',
          life: 3000
        });
        console.error('Error:', error);
      }
    });
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (response) => (this.teachers = response.teachers),
      error: () => (this.teachers = [])
    });
  }

  initializeColumns() {
    this.cols = [
      { field: 'title', header: 'Título' },
      { field: 'teacherId', header: 'Profesor' },
      { field: 'authorType', header: 'Tipo de autor' },
      { field: 'abstract', header: 'Resumen' },
      { field: 'keywords', header: 'Palabras clave' },
      { field: 'receivedDate', header: 'Fecha recibido' }
    ];
    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  getTeacherName(teacherId: number): string {
    const teacher = this.teachers.find(t => t.id === teacherId);
    return teacher ? teacher.fullName : teacherId?.toString() || '';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.article = {
      teacherId: 0,
      authorType: null,
      title: '',
      abstract: '',
      keywords: '',
      receivedDate: new Date()
    };
    this.submitted = false;
    this.articleDialog = true;
  }

  editArticle(article: Article) {
    this.article = { ...article };
    this.articleDialog = true;
  }

  deleteSelectedArticles() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los artículos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletePromises = this.selectedArticles!.map(article =>
          this.articleService.deleteArticle(article.id!).toPromise()
        );

        Promise.all(deletePromises).then(() => {
          this.loadArticles();
          this.selectedArticles = null;
          this.messageService.add({
            severity: 'success',
            summary: 'Exitoso',
            detail: 'Artículos eliminados',
            life: 3000
          });
        }).catch(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar artículos',
            life: 3000
          });
        });
      }
    });
  }

  hideDialog() {
    this.articleDialog = false;
    this.submitted = false;
  }

  deleteArticle(article: Article) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el artículo "' + article.title + '"?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.articleService.deleteArticle(article.id!).subscribe({
          next: () => {
            this.loadArticles();
            this.article = {} as Article;
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Artículo eliminado',
              life: 3000
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el artículo',
              life: 3000
            });
          }
        });
      }
    });
  }

  saveArticle() {
    this.submitted = true;

    if (
        (this.article.teacherId !== null && this.article.teacherId !== undefined) &&
        !!this.article.authorType &&
        !!this.article.title && this.article.title.trim().length > 0 &&
        !!this.article.abstract && this.article.abstract.trim().length > 0 &&
        !!this.article.keywords && this.article.keywords.trim().length > 0 &&
        !!this.article.receivedDate
    ) {
        if (this.article.id) {
            this.articleService.updateArticle(this.article.id, this.article).subscribe({
                next: () => {
                    this.loadArticles();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exitoso',
                        detail: 'Artículo actualizado',
                        life: 3000
                    });
                    this.articleDialog = false;
                    this.article = {} as Article;
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar el artículo',
                        life: 3000
                    });
                }
            });
        } else {
            this.articleService.createArticle(this.article).subscribe({
                next: () => {
                    this.loadArticles();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exitoso',
                        detail: 'Artículo creado',
                        life: 3000
                    });
                    this.articleDialog = false;
                    this.article = {} as Article;
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al crear el artículo',
                        life: 3000
                    });
                }
            });
        }
    }
}

}