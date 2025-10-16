import { Request, Response } from 'express';
import { Evaluation } from '../models/evaluation.model'; // Importa el modelo Sequelize

export class EvaluationController {
  /**
   * Método de prueba para verificar que el controlador está funcionando.
   */
  public async test(req: Request, res: Response): Promise<void> {
    try {
      res.send('Test method for Evaluation');
    } catch (error) {
      res.status(500).json({ msg: "Error in the test method" });
    }
  }

  /**
   * Obtiene todas las evaluaciones de la base de datos.
   */
  public async getAllEvaluations(req: Request, res: Response): Promise<void> {
    try {
      const evaluations = await Evaluation.findAll();
      res.status(200).json({ evaluations });
    } catch (error) {
      res.status(500).json({ msg: "Error retrieving evaluations" });
    }
  }

  /**
   * Obtiene una evaluación específica por su ID.
   */
  public async getOneEvaluation(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const evaluation = await Evaluation.findByPk(id);
      if (evaluation) {
        res.status(200).json(evaluation);
      } else {
        res.status(404).json({ msg: "Evaluation not found" });
      }
    } catch (error) {
      res.status(500).json({ msg: "Internal error" });
    }
  }

  /**
   * Crea una nueva evaluación.
   */
  public async createEvaluation(req: Request, res: Response): Promise<void> {
    const { articleId, reviewerId, evaluationDate, approvalStatus } = req.body;
  
    if (!articleId || !reviewerId || !evaluationDate || !approvalStatus) {
      res.status(400).json({ msg: "Missing required fields" });
      return;
    }
  
    try {
      const evaluation = await Evaluation.create({
        articleId,
        reviewerId,
        evaluationDate,
        approvalStatus // CORRECTO
      });
      res.status(201).json({ evaluation });
    } catch (error) {
      res.status(500).json({ msg: "Error creating evaluation", error });
    }
  }
  

  /**
   * Actualiza una evaluación existente según su ID.
   */
  public async updateEvaluation(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { articleId, reviewerId, evaluationDate, approvedStatus } = req.body;
    try {
      const evaluationExist = await Evaluation.findByPk(id);
      if (!evaluationExist) {
        res.status(404).json({ msg: "Evaluation not found" });
        return;
      }

      await Evaluation.update(
        { articleId, reviewerId, evaluationDate, approvedStatus },
        { where: { id } }
      );

      const updatedEvaluation = await Evaluation.findByPk(id);
      res.status(200).json({ updatedEvaluation });
    } catch (error) {
      res.status(500).json({ msg: "Error updating evaluation" });
    }
  }

  /**
   * Elimina una evaluación por su ID.
   */
  public async deleteEvaluation(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const evaluationExist = await Evaluation.findByPk(id);
      if (!evaluationExist) {
        res.status(404).json({ msg: "Evaluation not found" });
        return;
      }

      await Evaluation.destroy({ where: { id } });
      res.status(200).json({ msg: "Evaluation deleted successfully" });
    } catch (error) {
      res.status(500).json({ msg: "Error deleting evaluation" });
    }
  }
}
