import { Application } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { authMiddleware } from "../middleware/auth";


export class TeacherRoutes {
  public teacherController: TeacherController = new TeacherController();

  public routes(app: Application): void {
    app.route("/teachers/login").post(authMiddleware,this.teacherController.loginTeacher);
    app.route("/teachers/test").get(authMiddleware,this.teacherController.test.bind(this.teacherController));
    app.route("/teachers").get(authMiddleware,this.teacherController.getAllTeachers.bind(this.teacherController));
    app.route("/teachers/:id").get(authMiddleware,this.teacherController.getOneTeacher.bind(this.teacherController));
    app.route("/teachers").post(authMiddleware,this.teacherController.createTeacher.bind(this.teacherController));
    app.route("/teachers/:id").put(authMiddleware,this.teacherController.updateTeacher.bind(this.teacherController));
    app.route("/teachers/:id").delete(authMiddleware,this.teacherController.deleteTeacher.bind(this.teacherController));
  }
}
