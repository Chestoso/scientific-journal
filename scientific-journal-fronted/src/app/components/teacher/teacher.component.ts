import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TeacherService, Teacher } from '../../services/teacher.service';
import { HttpClientModule } from '@angular/common/http';
import { PasswordModule } from 'primeng/password';

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
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    HttpClientModule,
    PasswordModule
  ],
  providers: [MessageService, TeacherService, ConfirmationService],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent implements OnInit {
  teacherDialog: boolean = false;

  teachers = signal<Teacher[]>([]);

  teacher!: Teacher;

  selectedTeachers!: Teacher[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
      private teacherService: TeacherService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
  ) {}

  exportCSV() {
      this.dt.exportCSV();
  }

  ngOnInit() {
      this.loadTeachers();
      this.initializeColumns();
  }

  loadTeachers() {
      this.teacherService.getTeachers().subscribe({
          next: (response) => {
              this.teachers.set(response.teachers);
          },
          error: (error) => {
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al cargar los docentes',
                  life: 3000
              });
              console.error('Error:', error);
          }
      });
  }

  initializeColumns() {
      this.statuses = [
          { label: 'Activo', value: 'Activo' },
          { label: 'Inactivo', value: 'Inactivo' },
          { label: 'Vacaciones', value: 'Vacaciones' }
      ];

      this.cols = [
          { field: 'fullName', header: 'Nombre' },
          { field: 'university', header: 'Universidad' },
          { field: 'email', header: 'Email' },
          { field: 'orcid', header: 'ORCID' }
      ];

      this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
      this.teacher = {
          fullName: '',
          university: '',
          email: '',
          orcid: '',
          password: ''
      };
      this.submitted = false;
      this.teacherDialog = true;
  }

  editTeacher(teacher: Teacher) {
      this.teacher = { ...teacher };
      this.teacherDialog = true;
  }

  deleteSelectedTeachers() {
      this.confirmationService.confirm({
          message: '¿Está seguro que desea eliminar los docentes seleccionados?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              const deletePromises = this.selectedTeachers!.map(teacher => 
                  this.teacherService.deleteTeacher(teacher.id!).toPromise()
              );
              
              Promise.all(deletePromises).then(() => {
                  this.loadTeachers();
                  this.selectedTeachers = null;
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Exitoso',
                      detail: 'Docentes eliminados',
                      life: 3000
                  });
              }).catch(error => {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Error al eliminar docentes',
                      life: 3000
                  });
              });
          }
      });
  }

  hideDialog() {
      this.teacherDialog = false;
      this.submitted = false;
  }

  deleteTeacher(teacher: Teacher) {
      this.confirmationService.confirm({
          message: '¿Está seguro que desea eliminar a ' + teacher.fullName + '?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.teacherService.deleteTeacher(teacher.id!).subscribe({
                  next: () => {
                      this.loadTeachers();
                      this.teacher = {} as Teacher;
                      this.messageService.add({
                          severity: 'success',
                          summary: 'Exitoso',
                          detail: 'Docente eliminado',
                          life: 3000
                      });
                  },
                  error: (error) => {
                      this.messageService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Error al eliminar el docente',
                          life: 3000
                      });
                  }
              });
          }
      });
  }

  getSeverity(status: string) {
      switch (status) {
          case 'Activo':
              return 'success';
          case 'Inactivo':
              return 'danger';
          case 'Vacaciones':
              return 'warn';
          default:
              return 'info';
      }
  }

  saveTeacher() {
      this.submitted = true;
      
      if (this.teacher.fullName?.trim() && this.teacher.university?.trim() && 
          this.teacher.email?.trim() && this.teacher.orcid?.trim()) {
          
          if (this.teacher.id) {
              // Actualizar docente existente
              this.teacherService.updateTeacher(this.teacher.id, this.teacher).subscribe({
                  next: () => {
                      this.loadTeachers();
                      this.messageService.add({
                          severity: 'success',
                          summary: 'Exitoso',
                          detail: 'Docente actualizado',
                          life: 3000
                      });
                      this.teacherDialog = false;
                      this.teacher = {} as Teacher;
                  },
                  error: (error) => {
                      this.messageService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Error al actualizar el docente',
                          life: 3000
                      });
                  }
              });
          } else {
              // Crear nuevo docente
              if (!this.teacher.password?.trim()) {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'La contraseña es requerida para nuevos docentes',
                      life: 3000
                  });
                  return;
              }
              
              this.teacherService.createTeacher(this.teacher).subscribe({
                  next: () => {
                      this.loadTeachers();
                      this.messageService.add({
                          severity: 'success',
                          summary: 'Exitoso',
                          detail: 'Docente creado',
                          life: 3000
                      });
                      this.teacherDialog = false;
                      this.teacher = {} as Teacher;
                  },
                  error: (error) => {
                      this.messageService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Error al crear el docente',
                          life: 3000
                      });
                  }
              });
          }
      }
  }
}
