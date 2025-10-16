import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface EvaluationDetail {
  id?: number;
  evaluationId: number | null;
  description: string;
  evaluationStatus: 'Positive' | 'Negative' | 'Rejected' | 'Neutral' | null;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationDetailService {
  private apiUrl = 'http://localhost:4000/evaluation-details';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getEvaluationDetails(): Observable<{ details: EvaluationDetail[] }> {
    return this.http.get<{ details: EvaluationDetail[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getEvaluationDetail(id: number): Observable<{ detail: EvaluationDetail }> {
    return this.http.get<{ detail: EvaluationDetail }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createEvaluationDetail(detail: EvaluationDetail): Observable<{ detail: EvaluationDetail }> {
    return this.http.post<{ detail: EvaluationDetail }>(this.apiUrl, detail, { headers: this.getAuthHeaders() });
  }

  updateEvaluationDetail(id: number, detail: EvaluationDetail): Observable<{ updatedDetail: EvaluationDetail }> {
    return this.http.put<{ updatedDetail: EvaluationDetail }>(`${this.apiUrl}/${id}`, detail, { headers: this.getAuthHeaders() });
  }

  deleteEvaluationDetail(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}