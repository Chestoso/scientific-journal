import { Application } from 'express';
import { ReviewerController } from '../controllers/reviewer.controller';
import { authMiddleware } from "../middleware/auth";


export class ReviewerRoutes {
  public reviewerController: ReviewerController = new ReviewerController();

  public routes(app: Application): void {
    app.route('/reviewers/test').get(authMiddleware,this.reviewerController.test);
    app.route('/reviewers').get(authMiddleware,this.reviewerController.getAllReviewers);
    app.route('/reviewers/:id').get(authMiddleware,this.reviewerController.getOneReviewer);
    app.route('/reviewers').post(authMiddleware,this.reviewerController.createReviewer);
    app.route('/reviewers/:id').put(authMiddleware,this.reviewerController.updateReviewer);
    app.route('/reviewers/:id').delete(authMiddleware,this.reviewerController.deleteReviewer);
  }
}
