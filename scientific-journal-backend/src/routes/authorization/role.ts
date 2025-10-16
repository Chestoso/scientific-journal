import { Application } from "express";
import { RoleController } from '../../controllers/authorization/role.controller';

export class RoleRoutes {
  public roleController: RoleController = new RoleController();

  public routes(app: Application): void {

    app.route("/roles").post(this.roleController.createRole); // Crear un nuevo rol

  }
}