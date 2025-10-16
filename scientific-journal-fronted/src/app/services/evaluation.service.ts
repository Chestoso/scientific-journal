import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Evaluation {
  id?: number;
  articleId: number | null;
  reviewerId: number | null;
  evaluationDate: Date | string;
  approvalStatus: 'Approved' | 'Denied with corrections' | 'Rejected' | 'Pending' | null;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:4000/evaluations';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getEvaluations(): Observable<{ evaluations: Evaluation[] }> {
    return this.http.get<{ evaluations: Evaluation[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getEvaluation(id: number): Observable<{ evaluation: Evaluation }> {
    return this.http.get<{ evaluation: Evaluation }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createEvaluation(evaluation: Evaluation): Observable<{ evaluation: Evaluation }> {
    return this.http.post<{ evaluation: Evaluation }>(this.apiUrl, evaluation, { headers: this.getAuthHeaders() });
  }

  updateEvaluation(id: number, evaluation: Evaluation): Observable<{ updated: Evaluation }> {
    return this.http.put<{ updated: Evaluation }>(`${this.apiUrl}/${id}`, evaluation, { headers: this.getAuthHeaders() });
  }

  deleteEvaluation(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}