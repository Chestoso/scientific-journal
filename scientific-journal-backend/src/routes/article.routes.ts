import { Application } from 'express';
import { ArticleController } from '../controllers/article.controller';
import { authMiddleware } from "../middleware/auth";


export class ArticleRoutes {
  public controller: ArticleController = new ArticleController();

  public routes(app: Application): void {
    app.route('/articles/test').get(authMiddleware,this.controller.test);
    app.route('/articles').get(authMiddleware,this.controller.getAllArticles);
    app.route('/articles/:id').get(authMiddleware,this.controller.getOneArticle);
    app.route('/articles').post(authMiddleware,this.controller.createArticle);
    app.route('/articles/:id').put(authMiddleware,this.controller.updateArticle);
    app.route('/articles/:id').delete(authMiddleware,this.controller.deleteArticle);
  }
}
