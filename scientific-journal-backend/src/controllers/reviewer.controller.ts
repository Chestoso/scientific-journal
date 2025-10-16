import { Request, Response } from 'express';
import { Reviewer } from '../models/reviewer.model';

export class ReviewerController {
  // ✔ Método de prueba
  public async test(req: Request, res: Response): Promise<void> {
    try {
      res.send('Test method for Reviewer');
    } catch (error) {
      res.status(500).json({ msg: 'Error in the test method' });
    }
  }

  // ✔ Obtener todos los pares evaluadores
  public async getAllReviewers(req: Request, res: Response): Promise<void> {
    try {
      const reviewers = await Reviewer.findAll();
      res.status(200).json({ reviewers });
    } catch (error) {
      res.status(500).json({ msg: 'Error retrieving reviewers' });
    }
  }

  // ✔ Obtener un par evaluador por ID
  public async getOneReviewer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const reviewer = await Reviewer.findByPk(id);
      if (reviewer) {
        res.status(200).json(reviewer);
      } else {
        res.status(404).json({ msg: 'Reviewer not found' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Internal error' });
    }
  }

  // ✔ Crear un nuevo par evaluador
  public async createReviewer(req: Request, res: Response): Promise<void> {
    const { fullName, specialty, email, university } = req.body;

    try {
      const reviewer = await Reviewer.create({
        fullName,
        specialty,
        email,
        university
      });

      res.status(201).json({ reviewer });
    } catch (error) {
      res.status(500).json({ msg: 'Error creating reviewer' });
    }
  }

  // ✔ Actualizar par evaluador
  public async updateReviewer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { fullName, specialty, email, university } = req.body;

    try {
      const reviewerExist = await Reviewer.findByPk(id);
      if (!reviewerExist) {
        res.status(404).json({ msg: 'Reviewer not found' });
        return;
      }

      await Reviewer.update(
        {
          fullName,
          specialty,
          email,
          university
        },
        { where: { id } }
      );

      const updated = await Reviewer.findByPk(id);
      res.status(200).json({ updated });
    } catch (error) {
      res.status(500).json({ msg: 'Error updating reviewer' });
    }
  }

  // ✔ Eliminar par evaluador
  public async deleteReviewer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const exist = await Reviewer.findByPk(id);
      if (!exist) {
        res.status(404).json({ msg: 'Reviewer not found' });
        return;
      }

      await Reviewer.destroy({ where: { id } });
      res.status(200).json({ msg: 'Reviewer deleted successfully' });
    } catch (error) {
      res.status(500).json({ msg: 'Error deleting reviewer' });
    }
  }
}
