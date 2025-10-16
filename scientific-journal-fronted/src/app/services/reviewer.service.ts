import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Reviewer {
  id?: number;
  fullName: string;
  specialty: string;
  email: string;
  university: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewerService {
  private apiUrl = 'http://localhost:4000/reviewers';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getReviewers(): Observable<{ reviewers: Reviewer[] }> {
    return this.http.get<{ reviewers: Reviewer[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getReviewer(id: number): Observable<{ reviewer: Reviewer }> {
    return this.http.get<{ reviewer: Reviewer }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createReviewer(reviewer: Reviewer): Observable<{ reviewer: Reviewer }> {
    return this.http.post<{ reviewer: Reviewer }>(this.apiUrl, reviewer, { headers: this.getAuthHeaders() });
  }

  updateReviewer(id: number, reviewer: Reviewer): Observable<{ updated: Reviewer }> {
    return this.http.put<{ updated: Reviewer }>(`${this.apiUrl}/${id}`, reviewer, { headers: this.getAuthHeaders() });
  }

  deleteReviewer(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}