import { Request, Response } from "express";
import { Resource, ResourceI } from "../../models/authorization/Resource";

export class ResourceController {
 // Crear un nuevo recurso
  public async createResource(req: Request, res: Response): Promise<void> {
    const { path, method, is_active } = req.body;
    try {
      const newResource = await Resource.create({ path, method, is_active });
      res.status(201).json(newResource);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

}