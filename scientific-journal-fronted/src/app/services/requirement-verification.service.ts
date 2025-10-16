import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface RequirementVerification {
  id?: number;
  articleId: number | null;
  verificationDate: Date | string;
  meetsRequirements: 'Yes' | 'No' | null;
  observations: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequirementVerificationService {
  private apiUrl = 'http://localhost:4000/verifications';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getVerifications(): Observable<{ verifications: RequirementVerification[] }> {
    return this.http.get<{ verifications: RequirementVerification[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getVerification(id: number): Observable<{ verification: RequirementVerification }> {
    return this.http.get<{ verification: RequirementVerification }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createVerification(verification: RequirementVerification): Observable<{ newVerification: RequirementVerification }> {
    return this.http.post<{ newVerification: RequirementVerification }>(this.apiUrl, verification, { headers: this.getAuthHeaders() });
  }

  updateVerification(id: number, verification: RequirementVerification): Observable<{ updatedVerification: RequirementVerification }> {
    return this.http.put<{ updatedVerification: RequirementVerification }>(`${this.apiUrl}/${id}`, verification, { headers: this.getAuthHeaders() });
  }

  deleteVerification(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}