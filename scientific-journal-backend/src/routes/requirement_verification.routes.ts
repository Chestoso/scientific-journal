import { Application } from 'express';
import { RequirementVerificationController } from '../controllers/requirement_verification.controller';
import { authMiddleware } from "../middleware/auth";


export class RequirementVerificationRoutes {
  public controller: RequirementVerificationController = new RequirementVerificationController();

  public routes(app: Application): void {
    app.route('/verifications/test').get(authMiddleware,this.controller.test);
    app.route('/verifications').get(authMiddleware,this.controller.getAllVerifications);
    app.route('/verifications/:id').get(authMiddleware,this.controller.getOneVerification);
    app.route('/verifications').post(authMiddleware,this.controller.createVerification);
    app.route('/verifications/:id').put(authMiddleware,this.controller.updateVerification);
    app.route('/verifications/:id').delete(authMiddleware,this.controller.deleteVerification);
  }
}
