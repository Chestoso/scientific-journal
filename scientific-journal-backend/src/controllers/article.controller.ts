import { Request, Response } from 'express';
import { Article } from '../models/article.model';

export class ArticleController {
  // ✔ Método de prueba
  public async test(req: Request, res: Response): Promise<void> {
    try {
      res.send('Test method for Article');
    } catch (error) {
      res.status(500).json({ msg: 'Error in the test method' });
    }
  }

  // ✔ Obtener todos los artículos
  public async getAllArticles(req: Request, res: Response): Promise<void> {
    try {
      const articles = await Article.findAll();
      res.status(200).json({ articles });
    } catch (error) {
      res.status(500).json({ msg: 'Error retrieving articles' });
    }
  }

  // ✔ Obtener un artículo por ID
  public async getOneArticle(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const article = await Article.findByPk(id);
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ msg: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Internal error' });
    }
  }

  // ✔ Crear un nuevo artículo
  public async createArticle(req: Request, res: Response): Promise<void> {
    const { teacherId, authorType, title, abstract, keywords, receivedDate } = req.body;

    try {
      const article = await Article.create({
        teacherId,
        authorType,
        title,
        abstract,
        keywords,
        receivedDate
      });

      res.status(201).json({ article });
    } catch (error) {
      res.status(500).json({ msg: 'Error creating article' });
    }
  }

  // ✔ Actualizar un artículo
  public async updateArticle(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { teacherId, authorType, title, abstract, keywords, receivedDate } = req.body;

    try {
      const article = await Article.findByPk(id);
      if (!article) {
        res.status(404).json({ msg: 'Article not found' });
        return;
      }

      await Article.update(
        {
          teacherId,
          authorType,
          title,
          abstract,
          keywords,
          receivedDate
        },
        { where: { id } }
      );

      const updated = await Article.findByPk(id);
      res.status(200).json({ updated });
    } catch (error) {
      res.status(500).json({ msg: 'Error updating article' });
    }
  }

  // ✔ Eliminar un artículo
  public async deleteArticle(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const article = await Article.findByPk(id);
      if (!article) {
        res.status(404).json({ msg: 'Article not found' });
        return;
      }

      await Article.destroy({ where: { id } });
      res.status(200).json({ msg: 'Article deleted successfully' });
    } catch (error) {
      res.status(500).json({ msg: 'Error deleting article' });
    }
  }
}