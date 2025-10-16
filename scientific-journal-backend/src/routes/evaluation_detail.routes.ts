import { Application } from 'express';
import { EvaluationDetailController } from '../controllers/evaluation_detail.controller';
import { authMiddleware } from "../middleware/auth";


export class EvaluationDetailRoutes {
  // Instanciamos el controlador
  public controller: EvaluationDetailController = new EvaluationDetailController();

  // Definimos las rutas del módulo
  public routes(app: Application): void {
    // Método de prueba
    app.route('/evaluation-details/test').get(authMiddleware,this.controller.test);

    // Obtener todos los detalles de evaluación
    app.route('/evaluation-details').get(authMiddleware,this.controller.getAllEvaluationDetails);

    // Obtener un detalle por ID
    app.route('/evaluation-details/:id').get(authMiddleware,this.controller.getOneEvaluationDetail);

    // Crear un nuevo detalle
    app.route('/evaluation-details').post(authMiddleware,this.controller.createEvaluationDetail);

    // Actualizar un detalle existente
    app.route('/evaluation-details/:id').put(authMiddleware,this.controller.updateEvaluationDetail);

    // Eliminar un detalle por ID
    app.route('/evaluation-details/:id').delete(authMiddleware,this.controller.deleteEvaluationDetail);
  }
}
