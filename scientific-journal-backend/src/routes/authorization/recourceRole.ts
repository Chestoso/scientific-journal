import { Application } from "express";
import { ResourceRoleController } from "../../controllers/authorization/resourceRole.controller";

export class ResourceRoleRoutes {
  public resourceRoleController: ResourceRoleController = new ResourceRoleController();

  public routes(app: Application): void {

    app.route("/resource-roles").post(this.resourceRoleController.createResourceRole);
  }
}