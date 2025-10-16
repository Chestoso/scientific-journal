import { Request, Response } from "express";
import { ResourceRole, ResourceRoleI } from "../../models/authorization/ResourceRole.";

export class ResourceRoleController {
  // Crear un nuevo ResourceRole
  public async createResourceRole(req: Request, res: Response): Promise<void> {
    const { resource_id, role_id, is_active } = req.body;
    try {
      const newResourceRole = await ResourceRole.create({ resource_id, role_id, is_active });
      res.status(201).json(newResourceRole);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

