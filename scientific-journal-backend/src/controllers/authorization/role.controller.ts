import { Request, Response } from 'express';
import { Role, RoleI } from '../../models/authorization/Role';

export class RoleController {
// Crear un nuevo rol
  public async createRole(req: Request, res: Response): Promise<void> {
    const { name, is_active } = req.body;
    try {
      const newRole = await Role.create({ name, is_active });
      res.status(201).json(newRole);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}