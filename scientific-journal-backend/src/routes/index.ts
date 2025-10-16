import { Application } from "express";
import { ArticlePublicationRoutes } from "./article_publication.routes";
import { ArticleRoutes } from "./article.routes";
import { EvaluationDetailRoutes} from "./evaluation_detail.routes";
import { EvaluationRoutes } from "./evaluation.routes";
import { RequirementVerificationRoutes } from "./requirement_verification.routes";
import { ReviewerRoutes } from "./reviewer.routes";
import { TeacherRoutes } from "./teacher.routes";

import { AuthRoutes } from './authorization/auth';
import { ResourceRoutes } from './authorization/recource';
import { ResourceRoleRoutes } from './authorization/recourceRole';
import { RefreshTokenRoutes } from './authorization/refresk_token';
import { RoleUserRoutes } from './authorization/role_user';
import { RoleRoutes } from './authorization/role';


export class Routes {

  public authRoutes: AuthRoutes = new AuthRoutes();
  public resourceRoutes: ResourceRoutes = new ResourceRoutes();
  public refreshTokenRoutes: RefreshTokenRoutes = new RefreshTokenRoutes();
  public roleUserRoutes: RoleUserRoutes = new RoleUserRoutes();
  public roleRoutes: RoleRoutes = new RoleRoutes();
  public resourceRole: ResourceRoleRoutes = new ResourceRoleRoutes();

  //----------------------------------------------------------------------------------------
  public article_publicationRoutes: ArticlePublicationRoutes = new ArticlePublicationRoutes();
  public articleRoutes: ArticleRoutes = new ArticleRoutes();
  public evaluationDetailRoutes: EvaluationDetailRoutes = new EvaluationDetailRoutes();
  public evaluationRoutes: EvaluationRoutes = new EvaluationRoutes();
  public requirementVerificationRoutes: RequirementVerificationRoutes = new RequirementVerificationRoutes();
  public reviewerRoutes: ReviewerRoutes = new ReviewerRoutes();
  public teacherRoutes: TeacherRoutes = new TeacherRoutes();
  //---------------------------------------------------------

  public routes(app: Application): void {
    this.article_publicationRoutes.routes(app);
    this.articleRoutes.routes(app);
    this.evaluationDetailRoutes.routes(app);
    this.evaluationRoutes.routes(app);
    this.requirementVerificationRoutes.routes(app);
    this.reviewerRoutes.routes(app);
    this.teacherRoutes.routes(app);

  }
}
