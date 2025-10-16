import { Request, Response } from 'express';
import { RequirementVerification } from '../models/requirement_verification.model';

export class RequirementVerificationController {
  // ✔ Método de prueba
  public async test(req: Request, res: Response): Promise<void> {
    try {
      res.send('Test method for RequirementVerification');
    } catch (error) {
      res.status(500).json({ msg: 'Error in the test method' });
    }
  }

  // ✔ Obtener todas las verificaciones
  public async getAllVerifications(req: Request, res: Response): Promise<void> {
    try {
      const verifications = await RequirementVerification.findAll();
      res.status(200).json({ verifications });
    } catch (error) {
      res.status(500).json({ msg: 'Error retrieving verifications' });
    }
  }

  // ✔ Obtener una verificación por ID
  public async getOneVerification(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const verification = await RequirementVerification.findByPk(id);
      if (verification) {
        res.status(200).json(verification);
      } else {
        res.status(404).json({ msg: 'RequirementVerification not found' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Internal error' });
    }
  }

  // ✔ Crear una nueva verificación
  public async createVerification(req: Request, res: Response): Promise<void> {
    const { articleId, verificationDate, meetsRequirements, observations } = req.body;
    try {
      const newVerification = await RequirementVerification.create({
        articleId,
        verificationDate,
        meetsRequirements,
        observations
      });
      res.status(201).json({ newVerification });
    } catch (error) {
      res.status(500).json({ msg: 'Error creating verification' });
    }
  }

  // ✔ Actualizar una verificación
  public async updateVerification(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { articleId, verificationDate, meetsRequirements, observations } = req.body;

    try {
      const verification = await RequirementVerification.findByPk(id);
      if (!verification) {
        res.status(404).json({ msg: 'RequirementVerification not found' });
        return;
      }

      await RequirementVerification.update(
        { articleId, verificationDate, meetsRequirements, observations },
        { where: { id } }
      );

      const updatedVerification = await RequirementVerification.findByPk(id);
      res.status(200).json({ updatedVerification });
    } catch (error) {
      res.status(500).json({ msg: 'Error updating verification' });
    }
  }

  // ✔ Eliminar una verificación
  public async deleteVerification(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const verification = await RequirementVerification.findByPk(id);
      if (!verification) {
        res.status(404).json({ msg: 'RequirementVerification not found' });
        return;
      }

      await RequirementVerification.destroy({ where: { id } });
      res.status(200).json({ msg: 'RequirementVerification deleted successfully' });
    } catch (error) {
      res.status(500).json({ msg: 'Error deleting verification' });
    }
  }
}
