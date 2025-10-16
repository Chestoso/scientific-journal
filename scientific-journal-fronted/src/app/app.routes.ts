import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

import { TeacherComponent } from './components/teacher/teacher.component';
import { ArticleComponent } from './components/article/article.component';
import { ArticlePublicationComponent } from './components/article-publication/article-publication.component';
import { RequirementVerificationComponent } from './components/requirement-verification/requirement-verification.component';
import { ReviewerComponent } from './components/reviewer/reviewer.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { EvaluationDetailComponent } from './components/evaluation-detail/evaluation-detail.component';

export const routes: Routes = [
    { path: '', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'layout', component: LayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: '', component: TeacherComponent },
            { path: 'teacher', component: TeacherComponent },
            { path: 'article', component: ArticleComponent },
            { path: 'article-publication', component: ArticlePublicationComponent },
            { path: 'requirement-verification', component: RequirementVerificationComponent },
            { path: 'reviewer', component: ReviewerComponent },
            { path: 'evaluation', component: EvaluationComponent },
            { path: 'evaluation-detail', component: EvaluationDetailComponent },
        ]
     },
   { path: '**', redirectTo: 'login' }
];
