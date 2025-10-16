import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import { Article } from './article.model';

export class ArticlePublication extends Model {
  public id!: number;
  public articleId!: number;
  public publicationDate!: Date;
  public isbn!: string;
}

ArticlePublication.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  // FK al artículo publicado
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Fecha de publicación oficial
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

  // ISBN asignado al artículo publicado
  isbn: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'article_publications',
  sequelize: database,
  timestamps: false
});

// Relación uno a uno con el artículo
