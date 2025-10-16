import { Request, Response } from 'express';
import { EvaluationDetail } from '../models/evaluation_detail.model';

export class EvaluationDetailController {
  // ✔ Método de prueba
  public async test(req: Request, res: Response): Promise<void> {
    try {
      res.send('Test method for EvaluationDetail');
    } catch (error) {
      res.status(500).json({ msg: 'Error in the test method' });
    }
  }

  // ✔ Obtener todos los detalles de evaluación
  public async getAllEvaluationDetails(req: Request, res: Response): Promise<void> {
    try {
      const details = await EvaluationDetail.findAll();
      res.status(200).json({ details });
    } catch (error) {
      res.status(500).json({ msg: 'Error retrieving evaluation details' });
    }
  }

  // ✔ Obtener un detalle de evaluación por ID
  public async getOneEvaluationDetail(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const detail = await EvaluationDetail.findByPk(id);
      if (detail) {
        res.status(200).json(detail);
      } else {
        res.status(404).json({ msg: 'EvaluationDetail not found' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Internal error' });
    }
  }

  // ✔ Crear un nuevo detalle de evaluación
  public async createEvaluationDetail(req: Request, res: Response): Promise<void> {
    const { evaluationId, description, evaluationStatus } = req.body;
    try {
      const detail = await EvaluationDetail.create({
        evaluationId,
        description,
        evaluationStatus,
      });
      res.status(201).json({ detail });
    } catch (error) {
      res.status(500).json({ msg: 'Error creating evaluation detail' });
    }
  }

  // ✔ Actualizar un detalle de evaluación
  public async updateEvaluationDetail(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { evaluationId, description, evaluationStatus } = req.body;
    try {
      const detail = await EvaluationDetail.findByPk(id);
      if (!detail) {
        res.status(404).json({ msg: 'EvaluationDetail not found' });
        return;
      }

      await EvaluationDetail.update(
        { evaluationId, description, evaluationStatus },
        { where: { id } }
      );

      const updatedDetail = await EvaluationDetail.findByPk(id);
      res.status(200).json({ updatedDetail });
    } catch (error) {
      res.status(500).json({ msg: 'Error updating evaluation detail' });
    }
  }

  // ✔ Eliminar un detalle de evaluación
  public async deleteEvaluationDetail(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const detail = await EvaluationDetail.findByPk(id);
      if (!detail) {
        res.status(404).json({ msg: 'EvaluationDetail not found' });
        return;
      }

      await EvaluationDetail.destroy({ where: { id } });
      res.status(200).json({ msg: 'EvaluationDetail deleted successfully' });
    } catch (error) {
      res.status(500).json({ msg: 'Error deleting evaluation detail' });
    }
  }
}
