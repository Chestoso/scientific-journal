import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Teacher {
  id?: number;
  fullName: string;
  university: string;
  email: string;
  orcid: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:4000/teachers';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

getTeachers(): Observable<{ teachers: Teacher[] }> {
  return this.http.get<{ teachers: Teacher[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
}


  getTeacher(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createTeacher(teacher: Teacher): Observable<{ teacher: Teacher }> {
    return this.http.post<{ teacher: Teacher }>(this.apiUrl, teacher, { headers: this.getAuthHeaders() });
  }

  updateTeacher(id: number, teacher: Teacher): Observable<{ teacher: Teacher }> {
    return this.http.put<{ teacher: Teacher }>(`${this.apiUrl}/${id}`, teacher, { headers: this.getAuthHeaders() });
  }

  deleteTeacher(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
