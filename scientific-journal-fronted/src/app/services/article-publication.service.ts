import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ArticlePublication {
  id?: number;
  articleId: number | null;
  publicationDate: string | Date;
  isbn: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticlePublicationService {
  private apiUrl = 'http://localhost:4000/article-publications';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getPublications(): Observable<{ publications: ArticlePublication[] }> {
    return this.http.get<{ publications: ArticlePublication[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getPublication(id: number): Observable<{ publication: ArticlePublication }> {
    return this.http.get<{ publication: ArticlePublication }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createPublication(pub: ArticlePublication): Observable<{ newPublication: ArticlePublication }> {
    return this.http.post<{ newPublication: ArticlePublication }>(this.apiUrl, pub, { headers: this.getAuthHeaders() });
  }

  updatePublication(id: number, pub: ArticlePublication): Observable<{ updatedPublication: ArticlePublication }> {
    return this.http.put<{ updatedPublication: ArticlePublication }>(`${this.apiUrl}/${id}`, pub, { headers: this.getAuthHeaders() });
  }

  deletePublication(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}