import { Request, Response } from 'express';
import { ArticlePublication } from '../models/article_publication.model';

export class ArticlePublicationController {
  // ✔ Método de prueba
  public async test(req: Request, res: Response): Promise<void> {
    try {
      res.send('Test method for ArticlePublication');
    } catch (error) {
      res.status(500).json({ msg: 'Error in the test method' });
    }
  }

  // ✔ Obtener todas las publicaciones
  public async getAllPublications(req: Request, res: Response): Promise<void> {
    try {
      const publications = await ArticlePublication.findAll();
      res.status(200).json({ publications });
    } catch (error) {
      res.status(500).json({ msg: 'Error retrieving publications' });
    }
  }

  // ✔ Obtener una publicación por ID
  public async getOnePublication(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const publication = await ArticlePublication.findByPk(id);
      if (publication) {
        res.status(200).json(publication);
      } else {
        res.status(404).json({ msg: 'ArticlePublication not found' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Internal error' });
    }
  }

  // ✔ Crear una nueva publicación
  public async createPublication(req: Request, res: Response): Promise<void> {
    const { articleId, publicationDate, isbn } = req.body;

    try {
      const newPublication = await ArticlePublication.create({
        articleId,
        publicationDate,
        isbn
      });
      res.status(201).json({ newPublication });
    } catch (error) {
      res.status(500).json({ msg: 'Error creating publication' });
    }
  }

  // ✔ Actualizar una publicación
  public async updatePublication(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { articleId, publicationDate, isbn } = req.body;

    try {
      const publication = await ArticlePublication.findByPk(id);
      if (!publication) {
        res.status(404).json({ msg: 'ArticlePublication not found' });
        return;
      }

      await ArticlePublication.update(
        { articleId, publicationDate, isbn },
        { where: { id } }
      );

      const updatedPublication = await ArticlePublication.findByPk(id);
      res.status(200).json({ updatedPublication });
    } catch (error) {
      res.status(500).json({ msg: 'Error updating publication' });
    }
  }

  // ✔ Eliminar una publicación
  public async deletePublication(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const publication = await ArticlePublication.findByPk(id);
      if (!publication) {
        res.status(404).json({ msg: 'ArticlePublication not found' });
        return;
      }

      await ArticlePublication.destroy({ where: { id } });
      res.status(200).json({ msg: 'ArticlePublication deleted successfully' });
    } catch (error) {
      res.status(500).json({ msg: 'Error deleting publication' });
    }
  }
}
