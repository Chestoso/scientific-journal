import { Application } from "express";
import { ResourceController } from "../../controllers/authorization/resource.controller";

export class ResourceRoutes {
  public resourceController: ResourceController = new ResourceController();

  public routes(app: Application): void {

    app.route("/resources").post(this.resourceController.createResource);

  }
}