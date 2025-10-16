import { Application } from "express";
import { RoleUserController } from '../../controllers/authorization/role_user.controller';


export class RoleUserRoutes {
  public roleUserController: RoleUserController = new RoleUserController();

  public routes(app: Application): void {

    app.route("/roleUsers").post(this.roleUserController.createRoleUser); 
  }
}