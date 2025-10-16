import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Article {
  id?: number;
  teacherId: number;
  authorType: 'Principal' | 'Coauthor' | null;
  title: string;
  abstract: string;
  keywords: string;
  receivedDate: Date | string;
}

export interface Teacher {
  id: number;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:4000/articles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getArticles(): Observable<{ articles: Article[] }> {
    return this.http.get<{ articles: Article[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getArticle(id: number): Observable<{ article: Article }> {
    return this.http.get<{ article: Article }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createArticle(article: Article): Observable<{ article: Article }> {
    return this.http.post<{ article: Article }>(this.apiUrl, article, { headers: this.getAuthHeaders() });
  }

  updateArticle(id: number, article: Article): Observable<{ article: Article }> {
    return this.http.put<{ article: Article }>(`${this.apiUrl}/${id}`, article, { headers: this.getAuthHeaders() });
  }

  deleteArticle(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}