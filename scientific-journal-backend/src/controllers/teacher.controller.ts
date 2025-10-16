import { Request, Response } from 'express';
import { Teacher } from '../models/teacher.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class TeacherController {

  // ✔ Método de prueba
  public async test(req: Request, res: Response): Promise<void> {
    try {
      res.send('Test method for Teacher');
    } catch (error) {
      res.status(500).json({ msg: "Error in the test method" });
    }
  }

  // ✔ Login docente
  public async loginTeacher(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const teacher = await Teacher.findOne({ where: { email } });

      if (!teacher) {
        res.status(404).json({ msg: "Teacher not found" });
        return;
      }

      const hashedPassword = teacher.getDataValue('password');
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        res.status(400).json({ msg: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        {
          id: teacher.id,
          name: teacher.fullName
        },
        process.env.TEACHER_JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        msg: "Login successful",
        token,
        teacher: {
          id: teacher.id,
          name: teacher.fullName
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ msg: "Login error" });
    }
  }

  // ✔ Obtener todos los docentes
  public async getAllTeachers(req: Request, res: Response): Promise<void> {
    try {
      const teachers = await Teacher.findAll();
      res.status(200).json({ teachers });
    } catch (error) {
      res.status(500).json({ msg: "Error retrieving teachers" });
    }
  }

  // ✔ Obtener un docente por ID
  public async getOneTeacher(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const teacher = await Teacher.findByPk(id);
      if (teacher) {
        res.status(200).json(teacher);
      } else {
        res.status(404).json({ msg: "Teacher not found" });
      }
    } catch (error) {
      res.status(500).json({ msg: "Internal error" });
    }
  }

  // ✔ Crear un docente (con contraseña cifrada)
  public async createTeacher(req: Request, res: Response): Promise<void> {
    const { fullName, university, email, orcid, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const teacher = await Teacher.create({
        fullName,
        university,
        email,
        orcid,
        password: hashedPassword
      });

      res.status(201).json({ teacher });
    } catch (error) {
      res.status(500).json({ msg: "Error creating teacher" });
    }
  }

  // ✔ Actualizar un docente (con cifrado si cambia la contraseña)
  public async updateTeacher(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { fullName, university, email, orcid, password } = req.body;

    try {
      const teacherExist = await Teacher.findByPk(id);
      if (!teacherExist) {
        res.status(404).json({ msg: "Teacher not found" });
        return;
      }

      const updatedData: any = {
        fullName,
        university,
        email,
        orcid
      };

      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      await Teacher.update(updatedData, { where: { id } });
      const updatedTeacher = await Teacher.findByPk(id);
      res.status(200).json({ updatedTeacher });
    } catch (error) {
      res.status(500).json({ msg: "Error updating teacher" });
    }
  }

  // ✔ Eliminar un docente
  public async deleteTeacher(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const teacherExist = await Teacher.findByPk(id);
      if (!teacherExist) {
        res.status(404).json({ msg: "Teacher not found" });
        return;
      }

      await Teacher.destroy({ where: { id } });
      res.status(200).json({ msg: "Teacher deleted successfully" });
    } catch (error) {
      res.status(500).json({ msg: "Error deleting teacher" });
    }
  }
}
