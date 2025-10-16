import { Application } from 'express';
import { EvaluationController } from '../controllers/evaluation.controller';
import { authMiddleware } from "../middleware/auth";


export class EvaluationRoutes {
  // Instancia del controlador que maneja la lógica de negocio
  public controller: EvaluationController = new EvaluationController();

  // Método que define todas las rutas disponibles para Evaluation
  public routes(app: Application): void {
    // Ruta de prueba
    app.route('/evaluations/test').get(authMiddleware,this.controller.test);

    // Obtener todas las evaluaciones
    app.route('/evaluations').get(authMiddleware,this.controller.getAllEvaluations);

    // Obtener una evaluación por ID
    app.route('/evaluations/:id').get(authMiddleware,this.controller.getOneEvaluation);

    // Crear una nueva evaluación
    app.route('/evaluations').post(authMiddleware,this.controller.createEvaluation);

    // Actualizar una evaluación existente
    app.route('/evaluations/:id').put(authMiddleware,this.controller.updateEvaluation);

    // Eliminar una evaluación por ID
    app.route('/evaluations/:id').delete(authMiddleware,this.controller.deleteEvaluation);
  }
}
