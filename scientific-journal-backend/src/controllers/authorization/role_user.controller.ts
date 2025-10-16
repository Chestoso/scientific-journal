import { Request, Response } from 'express';
import { RoleUser, RoleUserI } from '../../models/authorization/RoleUser';

export class RoleUserController {
    
     public async createRoleUser(req: Request, res: Response): Promise<void> {
    const { role_id, user_id, is_active } = req.body;
    try {
      const newRoleUser = await RoleUser.create({ role_id, user_id, is_active });
      res.status(201).json(newRoleUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}