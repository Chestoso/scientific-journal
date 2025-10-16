import { Application } from 'express';
import { ArticlePublicationController } from '../controllers/article_publication.controller';
import { authMiddleware } from "../middleware/auth";


export class ArticlePublicationRoutes {
  public controller: ArticlePublicationController = new ArticlePublicationController();

  public routes(app: Application): void {
    app.route('/article-publications/test').get(authMiddleware,this.controller.test);
    app.route('/article-publications').get(authMiddleware,this.controller.getAllPublications);
    app.route('/article-publications/:id').get(authMiddleware,this.controller.getOnePublication);
    app.route('/article-publications').post(authMiddleware,this.controller.createPublication);
    app.route('/article-publications/:id').put(authMiddleware,this.controller.updatePublication);
    app.route('/article-publications/:id').delete(authMiddleware,this.controller.deletePublication);
  }
}
